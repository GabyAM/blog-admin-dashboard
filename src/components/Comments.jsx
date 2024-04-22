import { usePagination } from '../hooks/usePagination';
import { Comment } from './Comment';
import '../styles/comments.css';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { CommentSkeleton } from './CommentSkeleton';

export function Comments() {
    const { encodedToken } = useAuth();

    const {
        results: comments,
        setResults: setComments,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        hasNextPage,
        refetch
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

    async function submitPostEdit(id, text) {
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

    function submitPostDelete(id) {
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
                    newComments.splice(commentIndex, 0, prevComment);
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

    return (
        <section>
            <h2 className="section-title">Comments</h2>
            <div className="comments flex-col">
                {loading ? (
                    <>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                    </>
                ) : (
                    !error &&
                    comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onEdit={submitPostEdit}
                            onDelete={submitPostDelete}
                        ></Comment>
                    ))
                )}
                {hasNextPage && !loading && loadingNextPage ? (
                    <>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                    </>
                ) : (
                    <button
                        className="load-more-button"
                        onClick={() => {
                            fetchNextPage();
                        }}
                    >
                        Load more
                    </button>
                )}
            </div>
        </section>
    );
}
