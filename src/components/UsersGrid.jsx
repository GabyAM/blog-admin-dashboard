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
                {!loading &&
                    !error &&
                    users.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            onChangeRole={changeUserRole}
                            onDelete={deleteUser}
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
