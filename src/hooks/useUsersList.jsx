import {
    useInfiniteQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
    fetchAdmins,
    fetchAllUsers,
    fetchBannedUsers,
    fetchRegularUsers,
    submitDeleteUser,
    updateUserRole
} from '../api/user';
import toast from 'react-hot-toast';
import { useSearch } from './useSearch';
import { mapPagesResults } from '../utils/map';
import he from 'he';

export function useUsersList({ type, enabled = true }) {
    // type: all || user || admin || banned
    const { encodedToken } = useAuth();
    const { search } = useSearch();

    let fetchFn;
    if (type === 'all') fetchFn = fetchAllUsers;
    else if (type === 'user') fetchFn = fetchRegularUsers;
    else if (type === 'admin') fetchFn = fetchAdmins;
    else fetchFn = fetchFn = fetchBannedUsers;
    const {
        data: users,
        isLoading,
        error,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ['users', type, search],
        queryFn: () => fetchFn(6, search, encodedToken),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.metadata.nextPageParams,
        enabled,
        select: (users) =>
            mapPagesResults(users, (user) => ({
                ...user,
                name: he.unescape(user.name),
                email: he.unescape(user.email)
            }))
    });

    const queryClient = useQueryClient();
    function updateUser(id, update) {
        queryClient.setQueryData(['users', type, search], (prevData) => ({
            ...prevData,
            pages: prevData.pages.map((page) => ({
                ...page,
                results: page.results.map((user) =>
                    user._id === id ? { ...user, ...update } : user
                )
            }))
        }));
    }
    function deleteUser(id) {
        queryClient.setQueryData(['users', type, search], (prevData) => ({
            ...prevData,
            pages: prevData.pages.map((page) => ({
                ...page,
                results: page.results.filter((user) => user._id !== id)
            }))
        }));
    }

    const changeRoleMutation = useMutation({
        mutationKey: ['change_user_role'],
        onMutate: ({ id }) => updateUser(id, { isPending: true }),
        mutationFn: ({ id, action }) =>
            updateUserRole(id, action, encodedToken),
        onSuccess: (data, variables) => {
            const { id, action } = variables;
            if (type === 'all') {
                const update = { isPending: false };

                if (action === 'ban') {
                    update.is_banned = true;
                    update.is_admin = false;
                } else if (action === 'unban') update.is_banned = false;
                else if (action === 'promote') update.is_admin = true;
                else if (action === 'demote') update.is_admin = false;

                updateUser(id, { isPending: false, ...update });
            } else {
                deleteUser(id);
                let otherUsers;
                if (action === 'promote') {
                    otherUsers = 'admin';
                } else if (action === 'demote' || action === 'unban') {
                    otherUsers = 'user';
                } else if (action === 'ban') {
                    otherUsers = 'banned';
                }
                if (queryClient.getQueryData(['users', otherUsers, search])) {
                    queryClient.setQueryData(
                        ['users', otherUsers, search],
                        (prevData) => {
                            if (!prevData) return prevData;
                            return {
                                ...prevData,
                                pages: prevData.pages.map((page, index) => {
                                    if (index === 0) {
                                        return {
                                            ...page,
                                            results: [
                                                data.user,
                                                ...page.results
                                            ]
                                        };
                                    }
                                    return page;
                                })
                            };
                        }
                    );
                }
            }
        },
        onError: (e, variables) => {
            updateUser(variables.id, { isPending: false });
            throw new Error(`Couldn't ${variables.action} the user`);
        }
    });

    function handleChangeUserRole(action, id) {
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
        toast.promise(changeRoleMutation.mutateAsync({ id, action }), {
            loading: loadingTexts[action],
            success: successTexts[action],
            error: (e) => e.message
        });
    }

    const deleteMutation = useMutation({
        mutationKey: ['delete_user'],
        onMutate: (id) => updateUser(id, { isPending: true }),
        mutationFn: (id) => submitDeleteUser(id, encodedToken),
        onSuccess: (data, id) => deleteUser(id),
        onError: (e, id) => {
            updateUser(id, { isPending: false });
            throw new Error("Couldn't delete user");
        }
    });
    function handleDeleteUser(id) {
        return toast.promise(deleteMutation.mutateAsync(id), {
            loading: 'Deleting user...',
            success: 'User deleted',
            error: (e) => e.message
        });
    }

    return {
        users,
        isLoading,
        error,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        hasNextPage,
        handleChangeUserRole,
        handleDeleteUser
    };
}
