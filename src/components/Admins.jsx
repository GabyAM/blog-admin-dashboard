import { UsersGrid } from './UsersGrid';
import { useUsers } from '../hooks/useUsers';

export function Admins() {
    const {
        admins,
        loadingAdmins,
        adminsError,
        fetchNextPageAdmins,
        loadingNextPageAdmins,
        nextPageErrorAdmins,
        hasNextPageAdmins,
        handleChangeUserRole,
        handleDeleteUser
    } = useUsers();
    return (
        <UsersGrid
            title="Admins"
            users={admins}
            loading={loadingAdmins}
            error={adminsError}
            fetchNextPage={fetchNextPageAdmins}
            loadingNextPage={loadingNextPageAdmins}
            nextPageError={nextPageErrorAdmins}
            changeUserRole={(action, id) =>
                handleChangeUserRole('admin', action, id)
            }
            deleteUser={(id) => handleDeleteUser('admin', id)}
        ></UsersGrid>
    );
}
