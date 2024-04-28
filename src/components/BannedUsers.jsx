import { UsersGrid } from './UsersGrid';
import { useUsers } from '../hooks/useUsers';

export function BannedUsers() {
    const {
        banneds,
        loadingBanneds,
        bannedsError,
        fetchNextPageBanneds,
        loadingNextPageBanneds,
        nextPageErrorBanneds,
        hasNextPageBanneds,

        handleChangeUserRole,
        handleDeleteUser
    } = useUsers();
    return (
        <UsersGrid
            title="Banned users"
            users={banneds}
            loading={loadingBanneds}
            error={bannedsError}
            fetchNextPage={fetchNextPageBanneds}
            loadingNextPage={loadingNextPageBanneds}
            nextPageError={nextPageErrorBanneds}
            changeUserRole={(action, id) =>
                handleChangeUserRole('banned', action, id)
            }
            deleteUser={(id) => handleDeleteUser('banned', id)}
        ></UsersGrid>
    );
}
