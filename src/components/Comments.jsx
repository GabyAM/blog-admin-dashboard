import { usePagination } from '../hooks/usePagination';
import { Comment } from './Comment';
import { useAuth } from '../hooks/useAuth';

export function Comments() {
    const {
        results: comments,
        setResults: setComments,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        hasNextPage,
        refetch
    } = usePagination('http://localhost:3000/comments', 4);

    return (
        <section>
            <h2 className="section-title">Comments</h2>
            <div className="comments flex-col">
                {!loading &&
                    !error &&
                    comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                        ></Comment>
                    ))}
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
            </div>
        </section>
    );
}
