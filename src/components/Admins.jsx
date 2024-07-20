import { Users } from './Users';
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
    } = useUsersList({ type: 'admin' });
    return (
        <Users
            title="Admins"
            users={users}
            isLoading={isLoading}
            error={error}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isFetchNextPageError={isFetchNextPageError}
            changeUserRole={handleChangeUserRole}
            deleteUser={handleDeleteUser}
        ></Users>
    );
}
