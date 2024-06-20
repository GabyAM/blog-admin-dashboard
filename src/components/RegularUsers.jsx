import { UsersGrid } from './UsersGrid';
import { useUsersList } from '../hooks/useUsersList';

export function RegularUsers() {
    const {
        users,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        isFetchNextPageError,
        handleChangeUserRole,
        handleDeleteUser
    } = useUsersList('regular_users');
    return (
        <UsersGrid
            title="Users"
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
