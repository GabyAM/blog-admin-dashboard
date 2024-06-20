import { useUsersList } from '../hooks/useUsersList';
import { UsersGrid } from './UsersGrid';

export function BannedUsers() {
    const {
        users,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        isFetchNextPageError,
        handleChangeUserRole,
        handleDeleteUser
    } = useUsersList('banned_users');
    return (
        <UsersGrid
            title="Banned users"
            users={users}
            loading={isLoading}
            error={error}
            fetchNextPage={fetchNextPage}
            loadingNextPage={isFetchingNextPage}
            nextPageError={isFetchNextPageError}
            changeUserRole={handleChangeUserRole}
            deleteUser={handleDeleteUser}
        ></UsersGrid>
    );
}
