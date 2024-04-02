import { usePagination } from '../hooks/usePagination';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';

export function Drafts() {
    const {
        results: drafts,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
    } = usePagination('http://localhost:3000/unpublished_posts', 4);

    return (
        <>
            <h1>Unpublished posts</h1>
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
        </>
    );
}
