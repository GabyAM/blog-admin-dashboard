import { Comment } from './Comment';
import '../styles/comments.css';
import { CommentSkeleton } from './CommentSkeleton';
import { useComments } from '../hooks/useComments';

export function Comments() {
    const {
        comments,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        nextPageError,
        hasNextPage,
        handleCommentEdit,
        handleCommentDelete
    } = useComments();
    return (
        <section className="comments-container">
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
                            onEdit={handleCommentEdit}
                            onDelete={handleCommentDelete}
                        ></Comment>
                    ))
                )}
                {loadingNextPage && (
                    <>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                    </>
                )}
            </div>
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
        </section>
    );
}
