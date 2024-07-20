import { useEffect, useState } from 'react';
import { useUsersList } from '../hooks/useUsersList';
import { Users } from './Users';

export function ConditionalUsers() {
    const [shouldFetchAdmins, setShouldFetchAdmins] = useState(false);
    const { handleDeleteUser, handleChangeUserRole, ...userProps } =
        useUsersList({ type: 'user' });
    const {
        handleDeleteUser: handleDeleteAdmin,
        handleChangeUserRole: handleChangeAdminRole,
        ...adminProps
    } = useUsersList({ type: 'admin', enabled: shouldFetchAdmins });
    // banned users are never fetched since there can't be no admins

    useEffect(() => {
        if (!userProps.isLoading && !userProps.error) {
            const usersCount =
                userProps.users?.pages?.[0]?.results?.length || 0;
            setShouldFetchAdmins((prev) => {
                const newValue = usersCount === 0;
                if (newValue !== prev) return newValue;
                else return prev;
            });
        }
    }, [userProps.users, userProps.isLoading, userProps.error]);

    if (!shouldFetchAdmins) {
        return (
            <Users
                title="Users"
                changeUserRole={handleChangeUserRole}
                deleteUser={handleDeleteUser}
                {...userProps}
            ></Users>
        );
    } else {
        return (
            <Users
                title="Admins"
                changeUserRole={handleChangeAdminRole}
                deleteUser={handleDeleteAdmin}
                {...adminProps}
            ></Users>
        );
    }
}
