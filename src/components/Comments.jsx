import { Comment } from './Comment';
import '../styles/comments.css';
import { CommentSkeleton } from './CommentSkeleton';
import { useComments } from '../hooks/useComments';
import { useMemo, useState } from 'react';
import { DeletePopup } from './DeletePopup';
import { InfoCard } from './InfoCard';

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
    const [deletingId, setDeletingId] = useState(null);

    const hasResults = useMemo(() => {
        return (
            comments &&
            comments.pages &&
            comments.pages.some((page) => page.results.length > 0)
        );
    }, [comments]);

    return (
        <section className="comments-container">
            {deletingId && (
                <DeletePopup
                    title="Delete comment"
                    description="You are about to delete this comment and it can't be recovered later. are you sure?"
                    onDelete={() => handleCommentDelete(deletingId)}
                    onClickOutside={() => setDeletingId(null)}
                ></DeletePopup>
            )}
            <h2 className="section-title">Comments</h2>
            <div className="comments flex-col">
                {isLoading ? (
                    <>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                        <CommentSkeleton></CommentSkeleton>
                    </>
                ) : error && !isFetchNextPageError ? (
                    <InfoCard type="serverError" error={error}></InfoCard>
                ) : !hasResults ? (
                    <InfoCard type="noResults"></InfoCard>
                ) : (
                    comments.pages.map((page) =>
                        page.results.map((comment) => (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                onEdit={handleCommentEdit}
                                onDelete={(id) => setDeletingId(id)}
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
                {!isFetchingNextPage && isFetchNextPageError && (
                    <InfoCard
                        type="serverError"
                        error={error}
                        centered={true}
                    ></InfoCard>
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
