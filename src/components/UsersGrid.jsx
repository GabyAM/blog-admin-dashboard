import { UserCard } from './UserCard';

export function UsersGrid({
    title,
    users,
    loading,
    error,
    fetchNextPage,
    hasNextPage,
    loadingNextPage,
    nextPageError,
}) {
    return (
        <section className="main-section">
            <h1 className="section-title">{title}</h1>
            <div className="users-grid">
                {!loading &&
                    !error &&
                    users.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            onChangeRole={changeUserRole}
                        ></UserCard>
                    ))}
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
