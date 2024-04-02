import { usePagination } from '../hooks/usePagination';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';

export function Posts() {
    const {
        results: posts,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        hasNextPage
    } = usePagination('http://localhost:3000/published_posts', 4);

    return (
        <section>
            <h1 className="section-title">Published posts</h1>
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
                    posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            isPublished={true}
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
