import { UserCard } from './UserCard';
import '../styles/usersgrid.css';

export function UsersGrid({
    title,
    users,
    loading,
    error,
    fetchNextPage,
    hasNextPage,
    loadingNextPage,
    nextPageError,
    changeUserRole,
    deleteUser
}) {
    return (
        <section className="main-section">
            <h1 className="section-title">{title}</h1>
            <div className="users-grid">
                {loading ? (
                    <>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                    </>
                ) : (
                    !error &&
                    users.pages.map((page) =>
                        page.results.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                onChangeRole={changeUserRole}
                                onDelete={deleteUser}
                            ></UserCard>
                        ))
                    )
                )}
                {loadingNextPage && (
                    <>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
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
