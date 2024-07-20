import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import '../styles/posts.css';
import { useMemo, useState } from 'react';
import { DeletePopup } from './DeletePopup';
import { InfoCard } from './InfoCard';

export function Posts({
    title,
    posts,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    updatePostStatus,
    deletePost
}) {
    const [deletingId, setDeletingId] = useState(null);
    const hasResults = useMemo(() => {
        return (
            posts &&
            posts.pages &&
            posts.pages.some((page) => page.results.length > 0)
        );
    }, [posts]);

    return (
        <section className="main-section">
            <h1 className="section-title">{title}</h1>
            <div className="posts-grid">
                {deletingId && (
                    <DeletePopup
                        title="Delete post"
                        description="You are about to delete this post and it can't be recovered later. are you sure?"
                        onDelete={() => deletePost(deletingId)}
                        onClickOutside={() => setDeletingId(null)}
                    ></DeletePopup>
                )}
                {isLoading ? (
                    <>
                        <PostCardSkeleton></PostCardSkeleton>
                        <PostCardSkeleton></PostCardSkeleton>
                        <PostCardSkeleton></PostCardSkeleton>
                        <PostCardSkeleton></PostCardSkeleton>
                    </>
                ) : error && !isFetchNextPageError ? (
                    <InfoCard type="serverError" error={error}></InfoCard>
                ) : !hasResults ? (
                    <InfoCard type="noResults"></InfoCard>
                ) : (
                    posts.pages.map((page) =>
                        page.results.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onToggleState={updatePostStatus}
                                onDelete={() => setDeletingId(post._id)}
                            ></PostCard>
                        ))
                    )
                )}
                {isFetchingNextPage && (
                    <>
                        <PostCardSkeleton></PostCardSkeleton>
                        <PostCardSkeleton></PostCardSkeleton>
                        <PostCardSkeleton></PostCardSkeleton>
                        <PostCardSkeleton></PostCardSkeleton>
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
