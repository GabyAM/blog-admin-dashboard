import { useAuth } from '../hooks/useAuth';
import { usePagination } from '../hooks/usePagination';
import { UsersGrid } from './UsersGrid';

export function Users() {
    const { encodedToken } = useAuth();
    const {
        results: users,
        setResults: setUsers,
        loading: loadingUsers,
        error: usersError,
        fetchNextPage: fetchNextPageUsers,
        loadingNextPage: loadingNextPageUsers,
        nextPageError: nextPageErrorUsers
    } = usePagination(
        'http://localhost:3000/users?is_admin=false&is_banned=false',
        6
    );

    const {
        results: admins,
        setResults: setAdmins,
        loading: loadingAdmins,
        error: adminsError,
        fetchNextPage: fetchNextPageAdmins,
        loadingNextPage: loadingNextPageAdmins,
        nextPageError: nextPageErrorAdmins
    } = usePagination('http://localhost:3000/users?is_admin=true', 6);

    const {
        results: banneds,
        setResults: setBanneds,
        loading: loadingBanneds,
        error: bannedsError,
        fetchNextPage: fetchNextPageBanneds,
        loadingNextPage: loadingNextPageBanneds,
        nextPageError: nextPageErrorBanneds
    } = usePagination('http://localhost:3000/users?is_banned=true', 6);

    return (
        <>
            <UsersGrid
                title="Users"
                users={users}
                loading={loadingUsers}
                error={usersError}
                fetchNextPage={fetchNextPageUsers}
                loadingNextPage={loadingNextPageUsers}
                nextPageError={nextPageErrorUsers}
            ></UsersGrid>
            <UsersGrid
                title="Admins"
                users={admins}
                loading={loadingAdmins}
                error={adminsError}
                fetchNextPage={fetchNextPageAdmins}
                loadingNextPage={loadingNextPageAdmins}
                nextPageError={nextPageErrorAdmins}
            ></UsersGrid>
            <UsersGrid
                title="Banned users"
                users={banneds}
                loading={loadingBanneds}
                error={bannedsError}
                fetchNextPage={fetchNextPageBanneds}
                loadingNextPage={loadingNextPageBanneds}
                nextPageError={nextPageErrorBanneds}
            ></UsersGrid>
        </>
    );
}
