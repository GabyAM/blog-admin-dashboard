import { UserCard } from './UserCard';
import '../styles/usersgrid.css';
import { UserCardSkeleton } from './UserCardSkeleton';
import { useMemo, useState } from 'react';
import { DeletePopup } from './DeletePopup';
import { InfoCard } from './InfoCard';

export function Users({
    title,
    users,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    changeUserRole,
    deleteUser
}) {
    const [deletingId, setDeletingId] = useState(null);

    const hasResults = useMemo(() => {
        return (
            users &&
            users.pages &&
            users.pages.some((page) => page.results.length > 0)
        );
    }, [users]);

    return (
        <section className="main-section">
            {deletingId && (
                <DeletePopup
                    title="Delete user"
                    description="You are about to delete this user and it can't be recovered later. are you sure?"
                    onDelete={() => deleteUser(deletingId)}
                    onClickOutside={() => setDeletingId(null)}
                ></DeletePopup>
            )}
            <h1 className="section-title">{title}</h1>
            <div className="users-grid">
                {isLoading ? (
                    <>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                    </>
                ) : error && !isFetchNextPageError ? (
                    <InfoCard type="serverError" error={error}></InfoCard>
                ) : !hasResults ? (
                    <InfoCard type="noResults"></InfoCard>
                ) : (
                    users.pages.map((page) =>
                        page.results.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                onChangeRole={changeUserRole}
                                onDelete={(id) => setDeletingId(id)}
                            ></UserCard>
                        ))
                    )
                )}
                {isFetchingNextPage && (
                    <>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
                        <UserCardSkeleton></UserCardSkeleton>
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
