import toast from 'react-hot-toast';
import { useAuth } from './useAuth';
import { usePagination } from './usePagination';

export function useComments() {
    const { encodedToken } = useAuth();
    const {
        results: comments,
        setResults: setComments,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        nextPageError,
        hasNextPage
    } = usePagination('http://localhost:3000/comments', 4);

    function updateComment(index, updates) {
        setComments((prevComments) => {
            const newComments = [...prevComments];
            newComments[index] = {
                ...newComments[index],
                ...updates
            };
            return newComments;
        });
    }

    function handleCommentEdit(id, text) {
        const commentIndex = comments.findIndex(
            (comment) => comment._id === id
        );
        const prevText = comments[commentIndex].text;
        updateComment(commentIndex, { text, isPending: true });

        const promise = fetch(`http://localhost:3000/comment/${id}/update`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${encodedToken}`
            },
            body: JSON.stringify({ text })
        })
            .then(() => updateComment(commentIndex, { isPending: false }))
            .catch((e) => {
                updateComment(commentIndex, {
                    isPending: false,
                    text: prevText
                });
                throw new Error(e.message);
            });

        toast.promise(promise, {
            loading: 'Updating comment...',
            success: 'Comment updated!',
            error: "Couldn't update comment"
        });
    }

    function handleCommentDelete(id) {
        const commentIndex = comments.findIndex(
            (comment) => comment._id === id
        );
        const prevComment = comments[commentIndex];

        updateComment(commentIndex, { isPending: true });

        const promise = fetch(`http://localhost:3000/comment/${id}/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${encodedToken}`
            }
        })
            .then(() =>
                setComments((prevComments) => {
                    const newComments = [...prevComments];
                    newComments.splice(commentIndex, 1);
                    return newComments;
                })
            )
            .catch((e) => {
                setComments((prevComments) => {
                    const newComments = [...prevComments];
                    newComments[commentIndex].isPending = false;
                    return newComments;
                });
                throw new Error(e.message);
            });

        toast.promise(promise, {
            loading: 'Deleting comment...',
            success: 'Comment deleted!',
            error: "Couldn't delete comment"
        });
    }

    return {
        comments,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        nextPageError,
        hasNextPage,
        handleCommentEdit,
        handleCommentDelete
    };
}
