import { UsersGrid } from './UsersGrid';
import { useUsers } from '../hooks/useUsers';

export function RegularUsers() {
    const {
        users,
        loadingUsers,
        usersError,
        fetchNextPageUsers,
        loadingNextPageUsers,
        nextPageErrorUsers,
        hasNextPageUsers,
        handleChangeUserRole,
        handleDeleteUser
    } = useUsers();
    return (
        <UsersGrid
            title="Users"
            users={users}
            loading={loadingUsers}
            error={usersError}
            fetchNextPage={fetchNextPageUsers}
            loadingNextPage={loadingNextPageUsers}
            nextPageError={nextPageErrorUsers}
            changeUserRole={(action, id) =>
                handleChangeUserRole('user', action, id)
            }
            deleteUser={(id) => handleDeleteUser('user', id)}
        ></UsersGrid>
    );
}
