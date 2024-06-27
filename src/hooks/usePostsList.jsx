import toast from 'react-hot-toast';
import { useAuth } from './useAuth';
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import {
    fetchPublishedPosts,
    fetchUnpublishedPosts,
    submitDeletePost,
    submitPublishPost,
    submitUnpublishPost
} from '../api/post';
import { useSearch } from './useSearch';
import { useEffect } from 'react';

export function usePostsList({ published }) {
    const { encodedToken } = useAuth();

    const fetchFn = published ? fetchPublishedPosts : fetchUnpublishedPosts;
    const currentKey = published ? 'published_posts' : 'unpublished_posts';
    const otherKey = published ? 'unpublished_posts' : 'published_posts';

    const { search } = useSearch();

    const {
        data: posts,
        isLoading,
        error,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: [currentKey, search],
        queryFn: ({ pageParam }) => fetchFn(4, pageParam, search, encodedToken),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.metadata.nextPageParams
    });

    const queryClient = useQueryClient();
    function updatePost(id, update) {
        queryClient.setQueryData([currentKey], (prevData) => ({
            ...prevData,
            pages: prevData.pages.map((page) => ({
                ...page,
                results: page.results.map((post) =>
                    post._id === id ? { ...post, ...update } : post
                )
            }))
        }));
    }

    function deletePost(id) {
        queryClient.setQueryData([currentKey], (prevData) => ({
            ...prevData,
            pages: prevData.pages.map((page) => ({
                ...page,
                results: page.results.filter((post) => post._id !== id)
            }))
        }));
    }

    const updatePostStatus = published
        ? submitUnpublishPost
        : submitPublishPost;

    const updateStatusMutation = useMutation({
        mutationKey: ['update_post_status'],
        onMutate: (id) => updatePost(id, { isPending: true }),
        mutationFn: (id) => updatePostStatus(id, encodedToken),
        onSuccess: (data, id) => {
            if (data.error) {
                throw new Error(
                    "The post doesn't meet the requirements to be published"
                );
            }
            deletePost(id);
            if (queryClient.getQueryData([otherKey])) {
                queryClient.setQueryData([otherKey], (prevData) => {
                    if (!prevData) return prevData;
                    return {
                        ...prevData,
                        pages: prevData.pages.map((page, index) => {
                            if (index === 0) {
                                return {
                                    ...page,
                                    results: [data.post, ...page.results]
                                };
                            }
                            return page;
                        })
                    };
                });
            }
            console.log(queryClient.getQueryData([otherKey]));
        },
        onError: (e, id) => {
            updatePost(id, { isPending: false });
        }
    });

    function handleUpdatePostStatus(id) {
        toast.promise(updateStatusMutation.mutateAsync(id), {
            loading: published ? 'Unpublishing post...' : 'Publishing post...',
            success: `Post ${published ? 'unpublished' : 'published'} successfully`,
            error: (error) => `${error.message}`
        });
    }

    const deleteMutation = useMutation({
        mutationKey: ['delete_post'],
        onMutate: (id) => updatePost(id, { isPending: true }),
        mutationFn: (id) => submitDeletePost(id),
        onSuccess: (data, variables) => deletePost(variables.id),
        onError: (e, variables) =>
            updatePost(variables.id, { isPending: false })
    });

    function handleDeletePost(id) {
        toast.promise(deleteMutation.mutateAsync(id), {
            loading: 'Deleting post...',
            success: 'Post deleted!',
            error: (error) => `${error.message}`
        });
    }

    return {
        posts,
        isLoading,
        error,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        hasNextPage,
        handleUpdatePostStatus,
        handleDeletePost
    };
}
