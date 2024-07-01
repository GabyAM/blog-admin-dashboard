import toast from 'react-hot-toast';
import { useAuth } from './useAuth';
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import {
    fetchComments,
    submitDeleteComment,
    submitEditComment
} from '../api/comment';
import { useSearch } from './useSearch';

export function useComments() {
    const { encodedToken } = useAuth();
    const { search } = useSearch();

    const {
        data: comments,
        isLoading,
        error,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ['comments', search],
        queryFn: ({ pageParam }) => fetchComments(pageParam, 4, search),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.metadata.nextPageParams
    });

    const queryClient = useQueryClient();
    function updateComment(id, update) {
        queryClient.setQueryData(['comments', search], (prevData) => ({
            ...prevData,
            pages: prevData.pages.map((page) => ({
                ...page,
                results: page.results.map((comment) =>
                    comment._id === id ? { ...comment, ...update } : comment
                )
            }))
        }));
    }

    const editMutation = useMutation({
        mutationKey: ['edit_comment'],
        onMutate: ({ id, text }) =>
            updateComment(id, { text, isPending: true }),
        mutationFn: ({ id, text }) => submitEditComment(id, text, encodedToken),
        onSuccess: (data, variables) =>
            updateComment(variables.id, { isPending: false }),
        onError: (e, variables) => {
            const { id, prevText } = variables;
            updateComment(id, {
                isPending: false,
                text: prevText
            });
        }
    });

    function handleCommentEdit(id, prevText, text) {
        toast.promise(editMutation.mutateAsync({ id, prevText, text }), {
            loading: 'Updating comment...',
            success: 'Comment updated!',
            error: "Couldn't update comment"
        });
    }

    const deleteMutation = useMutation({
        mutationKey: ['delete_comment'],
        onMutate: (id) => updateComment(id, { isPending: true }),
        mutationFn: (id) => submitDeleteComment(id, encodedToken),
        onSuccess: (data, id) => {
            updateComment(id, { user: null, text: '', isPending: false });
        },
        onError: (e, id) => {
            updateComment(id, { isPending: false });
            throw new Error("Couldn't delete comment");
        }
    });
    function handleCommentDelete(id) {
        return toast.promise(deleteMutation.mutateAsync(id), {
            loading: 'Deleting comment...',
            success: 'Comment deleted!',
            error: (e) => e.message
        });
    }

    return {
        comments,
        isLoading,
        error,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        hasNextPage,
        handleCommentEdit,
        handleCommentDelete
    };
}
