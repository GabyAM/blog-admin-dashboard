import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import '../styles/posts.css';
import { useState } from 'react';
import { DeletePopup } from './DeletePopup';

export function Posts({
    title,
    posts,
    loading,
    error,
    fetchNextPage,
    loadingNextPage,
    hasNextPage,
    updatePostStatus,
    deletePost
}) {
    const [deletingId, setDeletingId] = useState(null);
    if (!posts || posts.pages[0].results.length > 0)
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
                    {loading ? (
                        <>
                            <PostCardSkeleton></PostCardSkeleton>
                            <PostCardSkeleton></PostCardSkeleton>
                            <PostCardSkeleton></PostCardSkeleton>
                            <PostCardSkeleton></PostCardSkeleton>
                        </>
                    ) : (
                        !error &&
                        posts.pages.map((page) =>
                            page.results.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onToggleState={updatePostStatus}
                                    // onDelete={deletePost}
                                    onDelete={() => setDeletingId(post._id)}
                                ></PostCard>
                            ))
                        )
                    )}
                    {loadingNextPage && (
                        <>
                            <PostCardSkeleton></PostCardSkeleton>
                            <PostCardSkeleton></PostCardSkeleton>
                            <PostCardSkeleton></PostCardSkeleton>
                            <PostCardSkeleton></PostCardSkeleton>
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
