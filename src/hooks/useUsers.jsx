import toast from 'react-hot-toast';
import { usePagination } from './usePagination';
import { useAuth } from './useAuth';

export function useUsers() {
    const { encodedToken } = useAuth();
    const {
        results: users,
        setResults: setUsers,
        loading: loadingUsers,
        error: usersError,
        fetchNextPage: fetchNextPageUsers,
        loadingNextPage: loadingNextPageUsers,
        nextPageError: nextPageErrorUsers,
        hasNextPage: hasNextPageUsers
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
        nextPageError: nextPageErrorAdmins,
        hasNextPage: hasNextPageAdmins
    } = usePagination('http://localhost:3000/users?is_admin=true', 6);

    const {
        results: banneds,
        setResults: setBanneds,
        loading: loadingBanneds,
        error: bannedsError,
        fetchNextPage: fetchNextPageBanneds,
        loadingNextPage: loadingNextPageBanneds,
        nextPageError: nextPageErrorBanneds,
        hasNextPage: hasNextPageBanneds
    } = usePagination('http://localhost:3000/users?is_banned=true', 6);

    function handleChangeUserRole(role, action, id) {
        let currentUsers, setCurrentUsers, setOtherUsers;
        if (role === 'admin') {
            currentUsers = admins;
            setCurrentUsers = setAdmins;
            setOtherUsers = action === 'demote' ? setUsers : setBanneds;
        } else if (role === 'user') {
            currentUsers = users;
            setCurrentUsers = setUsers;
            setOtherUsers = action === 'promote' ? setAdmins : setBanneds;
        } else {
            currentUsers = banneds;
            setCurrentUsers = setBanneds;
            setOtherUsers = setUsers;
        }

        const userIndex = currentUsers.findIndex((user) => user._id === id);
        const user = currentUsers[userIndex];

        setCurrentUsers((prevUsers) => {
            const newUsers = [...prevUsers];
            newUsers[userIndex].isPending = true;
            return newUsers;
        });

        const promise = fetch(`http://localhost:3000/user/${id}/${action}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Authorization: `bearer ${encodedToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setCurrentUsers((prevUsers) => {
                    const newUsers = [...prevUsers];
                    newUsers.splice(userIndex, 1);
                    return newUsers;
                });
                setOtherUsers((prevUsers) => {
                    if (action === 'promote' || action === 'demote') {
                        user.is_admin = action === 'promote';
                    } else if (action === 'ban' || action === 'unban') {
                        user.is_banned = action === 'ban';
                    }
                    user.isPending = false;
                    const newUsers = [user, ...prevUsers];
                    return newUsers;
                });
            })
            .catch((e) => {
                setCurrentUsers((prevUsers) => {
                    const newUsers = [...prevUsers];
                    newUsers[userIndex].isPending = false;
                    return newUsers;
                });
                throw new Error(`Couldn't ${action} the user`);
            });

        const loadingTexts = {
            promote: 'promoting...',
            demote: 'demoting...',
            ban: 'banning...',
            unban: 'unbanning...'
        };
        const successTexts = {
            promote: 'User promoted',
            demote: 'User demoted',
            ban: 'User banned',
            unban: 'User unbanned'
        };
        toast.promise(promise, {
            loading: loadingTexts[action],
            success: successTexts[action],
            error: (error) => error.message
        });
    }

    function handleDeleteUser(role, id) {
        let currentUsers, setCurrentUsers;
        if (role === 'admin') {
            currentUsers = admins;
            setCurrentUsers = setAdmins;
        } else if (role === 'user') {
            currentUsers = users;
            setCurrentUsers = setUsers;
        } else {
            currentUsers = banneds;
            setCurrentUsers = setBanneds;
        }

        const userIndex = currentUsers.findIndex((user) => user._id === id);
        setCurrentUsers((prevUsers) => {
            const newUsers = [...prevUsers];
            newUsers[userIndex].isPending = true;
            return newUsers;
        });

        const promise = fetch(`http://localhost:3000/user/${id}/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Authorization: `bearer ${encodedToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setCurrentUsers((prevUsers) => {
                    const newUsers = [...prevUsers];
                    newUsers.splice(userIndex, 1);
                    return newUsers;
                });
            })
            .catch((e) => {
                setCurrentUsers((prevUsers) => {
                    const newUsers = [...prevUsers];
                    newUsers[userIndex].isPending = false;
                    return newUsers;
                });
                throw new Error("Couldn't delete user");
            });

        toast.promise(promise, {
            loading: 'Deleting user...',
            success: 'User deleted',
            error: (error) => error.message
        });
    }

    return {
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
    };
}
