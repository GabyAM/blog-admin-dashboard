import toast from 'react-hot-toast';
import { useAuth } from './useAuth';
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import {
    fetchAllPosts,
    fetchPublishedPosts,
    fetchUnpublishedPosts,
    submitDeletePost,
    submitPublishPost,
    submitUnpublishPost
} from '../api/post';
import { useSearch } from './useSearch';

export function usePostsList({ type, enabled }) {
    // type: all || unpublished || published
    // if type === all, otherKey = ['unpublished', 'published']
    const { encodedToken } = useAuth();

    const fetchFn =
        type === 'all'
            ? fetchAllPosts
            : type === 'published'
              ? fetchPublishedPosts
              : fetchUnpublishedPosts;

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
        queryKey: ['posts', type, search],
        queryFn: ({ pageParam }) => fetchFn(4, pageParam, search, encodedToken),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.metadata.nextPageParams,
        enabled
    });

    const queryClient = useQueryClient();
    function updatePost(id, update) {
        queryClient.setQueryData(['posts', type, search], (prevData) => ({
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
        queryClient.setQueryData(['posts', type, search], (prevData) => ({
            ...prevData,
            pages: prevData.pages.map((page) => ({
                ...page,
                results: page.results.filter((post) => post._id !== id)
            }))
        }));
    }

    const updatePostStatus = (id, token, isPublished) =>
        isPublished
            ? submitUnpublishPost(id, token)
            : submitPublishPost(id, token);

    const updateStatusMutation = useMutation({
        mutationKey: ['update_post_status'],
        onMutate: ({ id }) => updatePost(id, { isPending: true }),
        mutationFn: ({ id, isPublished }) =>
            updatePostStatus(id, encodedToken, isPublished),
        onSuccess: (data, { id, isPublished }) => {
            if (data.error) {
                throw new Error(
                    "The post doesn't meet the requirements to be published"
                );
            }
            let otherKey;
            if (type !== 'all') {
                deletePost(id);
                otherKey = type === 'unpublished' ? 'published' : 'unpublished';
            } else {
                updatePost(id, {
                    isPending: false,
                    is_published: !isPublished
                });
            }
            if (
                otherKey &&
                queryClient.getQueryData(['posts', otherKey, search])
            ) {
                queryClient.setQueryData(
                    ['posts', otherKey, search],
                    (prevData) => {
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
                    }
                );
            }
        },
        onError: (e, { id }) => {
            updatePost(id, { isPending: false });
        }
    });

    function handleUpdatePostStatus(id, isPublished) {
        toast.promise(updateStatusMutation.mutateAsync({ id, isPublished }), {
            loading: isPublished
                ? 'Unpublishing post...'
                : 'Publishing post...',
            success: `Post ${isPublished ? 'unpublished' : 'published'} successfully`,
            error: (error) => `${error.message}`
        });
    }

    const deleteMutation = useMutation({
        mutationKey: ['delete_post'],
        onMutate: (id) => updatePost(id, { isPending: true }),
        mutationFn: (id) => submitDeletePost(id, encodedToken),
        onSuccess: (data, id) => deletePost(id),
        onError: (e, id) => {
            updatePost(id, { isPending: false });
            throw new Error("Couldn't delete the post");
        }
    });

    function handleDeletePost(id) {
        return toast.promise(deleteMutation.mutateAsync(id), {
            loading: 'Deleting post...',
            success: 'Post deleted!',
            error: (error) => error.message
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
