import {
    useInfiniteQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
    fetchAdmins,
    fetchBannedUsers,
    fetchRegularUsers,
    submitDeleteUser,
    updateUserRole
} from '../api/user';
import toast from 'react-hot-toast';
import { useSearch } from './useSearch';

export function useUsersList(type) {
    const { encodedToken } = useAuth();
    const { search } = useSearch();

    const fetchFn =
        type === 'regular_users'
            ? fetchRegularUsers
            : type === 'admin_users'
              ? fetchAdmins
              : fetchBannedUsers;
    const {
        data: users,
        isLoading,
        error,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: [type, search],
        queryFn: () => fetchFn(6, search),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.metadata.nextPageParams
    });

    const queryClient = useQueryClient();
    function updateUser(id, update) {
        queryClient.setQueryData([type], (prevData) => ({
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
        queryClient.setQueryData([type], (prevData) => ({
            ...prevData,
            pages: prevData.pages.map((page) => ({
                ...page,
                results: page.results.filter((user) => user._id !== id)
            }))
        }));
    }

    const changeRoleMutation = useMutation({
        mutationKey: ['change_user_role'],
        onMutate: ({ id, action }) => updateUser(id, { isPending: true }),
        mutationFn: ({ id, action }) =>
            updateUserRole(id, action, encodedToken),
        onSuccess: (data, variables) => {
            const { id, action } = variables;
            deleteUser(id);
            let otherUsers;
            if (action === 'promote') {
                otherUsers = 'admin_users';
            } else if (action === 'demote' || action === 'unban') {
                otherUsers = 'regular_users';
            } else if (action === 'ban') {
                otherUsers = 'banned_users';
            }
            if (queryClient.getQueryData([otherUsers])) {
                queryClient.setQueryData([otherUsers], (prevData) => {
                    if (!prevData) return prevData;
                    return {
                        ...prevData,
                        pages: prevData.pages.map((page, index) => {
                            if (index === 0) {
                                return {
                                    ...page,
                                    results: [data.user, ...page.results]
                                };
                            }
                            return page;
                        })
                    };
                });
            }
        },
        onError: (e, variables) =>
            updateUser(variables.id, { isPending: false })
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
            error: () => `Couldn't ${action} the user`
        });
    }

    const deleteMutation = useMutation({
        mutationKey: ['delete_user'],
        onMutate: (id) => updateUser(id, { isPending: true }),
        mutationFn: (id) => submitDeleteUser(id, encodedToken),
        onSuccess: (data, variables) => deleteUser(variables.id),
        onError: (e, variables) =>
            updateUser(variables.id, { isPending: false })
    });
    function handleDeleteUser(id) {
        toast.promise(deleteMutation.mutateAsync(id), {
            loading: 'Deleting user...',
            success: 'User deleted',
            error: () => "Couldn't delete user"
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
