import { UsersGrid } from './UsersGrid';
import { useUsersList } from '../hooks/useUsersList';

export function Admins() {
    const {
        users,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        isFetchNextPageError,
        handleChangeUserRole,
        handleDeleteUser
    } = useUsersList('admin_users');
    return (
        <UsersGrid
            title="Admins"
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
