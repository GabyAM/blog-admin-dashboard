import { Users } from './Users';
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
    } = useUsersList({ type: 'user' });
    return (
        <Users
            title="Users"
            users={users}
            isLoading={isLoading}
            error={error}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            nextPageError={isFetchNextPageError}
            changeUserRole={handleChangeUserRole}
            deleteUser={handleDeleteUser}
        ></Users>
    );
}
