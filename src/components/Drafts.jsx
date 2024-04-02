import { usePagination } from '../hooks/usePagination';
import '../styles/posts.css';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';

export function Drafts() {
    const {
        results: drafts,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        hasNextPage
    } = usePagination('http://localhost:3000/unpublished_posts', 4);

    return (
        <section>
            <h1 className="section-title">Unpublished posts</h1>
            <div className="posts-grid">
                {loading ? (
                    <>
                        <PostCardSkeleton></PostCardSkeleton>
                        <PostCardSkeleton></PostCardSkeleton>
                        <PostCardSkeleton></PostCardSkeleton>
                        <PostCardSkeleton></PostCardSkeleton>
                    </>
                ) : (
                    !error &&
                    drafts.map((draft) => (
                        <PostCard
                            key={draft._id}
                            post={draft}
                            isPublished={false}
                        ></PostCard>
                    ))
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
                <button className="load-more-button" onClick={fetchNextPage}>
                    Load more
                </button>
            )}
        </section>
    );
}
