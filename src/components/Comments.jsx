import { Comment } from './Comment';
import '../styles/comments.css';
import { CommentSkeleton } from './CommentSkeleton';
import { useComments } from '../hooks/useComments';
import { useState } from 'react';
import { DeletePopup } from './DeletePopup';

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

    if (!comments || comments.pages[0].results.length > 0)
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
                    ) : error ? (
                        <p>error</p>
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
