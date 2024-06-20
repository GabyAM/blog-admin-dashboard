import { Comment } from './Comment';
import '../styles/comments.css';
import { CommentSkeleton } from './CommentSkeleton';
import { useComments } from '../hooks/useComments';

export function Comments() {
    const {
        comments,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        isFetchNextPageError,
        hasNextPage,
        handleCommentEdit,
        handleCommentDelete
    } = useComments();
    return (
        <section className="comments-container">
            <h2 className="section-title">Comments</h2>
            <div className="comments flex-col">
                {isLoading ? (
                    <>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                    </>
                ) : (
                    !error &&
                    comments.pages.map((page) =>
                        page.results.map((comment) => (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                onEdit={handleCommentEdit}
                                onDelete={handleCommentDelete}
                            ></Comment>
                        ))
                    )
                )}
                {isFetchingNextPage && (
                    <>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                    </>
                )}
            </div>
            {hasNextPage && !isLoading && !isFetchingNextPage && (
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
