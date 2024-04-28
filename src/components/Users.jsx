import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { usePagination } from '../hooks/usePagination';
import { UsersGrid } from './UsersGrid';
import { useUsers } from '../hooks/useUsers';

export function Users() {
    const {
        users,
        loadingUsers,
        usersError,
        fetchNextPageUsers,
        loadingNextPageUsers,
        nextPageErrorUsers,
        hasNextPageUsers,

        admins,
        loadingAdmins,
        adminsError,
        fetchNextPageAdmins,
        loadingNextPageAdmins,
        nextPageErrorAdmins,
        hasNextPageAdmins,

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
        <>
            {users.length > 0 && (
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
            )}
            {admins.length > 0 && (
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
            )}
            {banneds.length > 0 && (
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
            )}
        </>
    );
}
