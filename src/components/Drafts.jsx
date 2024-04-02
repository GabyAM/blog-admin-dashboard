import { usePagination } from '../hooks/usePagination';
import { PostCard } from './PostCard';

export function Drafts() {
    const {
        results: drafts,
        loading,
        error,
        fetchNextPage
    } = usePagination('http://localhost:3000/unpublished_posts', 4);

    return (
        <>
            <h1>Unpublished posts</h1>
            <div className="posts-grid">
                {!loading &&
                    !error &&
                    drafts.map((draft) => (
                        <PostCard key={draft._id} post={draft}></PostCard>
                    ))}
                <button onClick={fetchNextPage}>Load more</button>
            </div>
        </>
    );
}
