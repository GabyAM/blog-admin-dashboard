import { usePagination } from '../hooks/usePagination';
import { Comment } from './Comment';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

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

    return (
        <section>
            <h2 className="section-title">Comments</h2>
            <div className="comments flex-col">
                {!loading &&
                    !error &&
                    comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onEdit={submitPostEdit}
                        ></Comment>
                    ))}
                {hasNextPage && !loading && !loadingNextPage && (
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
