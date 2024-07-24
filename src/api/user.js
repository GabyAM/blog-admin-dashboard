import { ServerError } from '../utils/error';
import { API_URL } from '../constants';

function fetchUsers(search, limit = 6, role, token) {
    let url = API_URL + `/users?limit=${limit}`;
    if (role === 'user') {
        url += '&is_banned=false&is_admin=false';
    } else if (role === 'admin') {
        url += '&is_admin=true';
    } else if (role === 'banned') {
        url += '&is_banned=true';
    }
    if (search) {
        url += `&search=${search}`;
    }
    const options = {};
    if (token) {
        options.credentials = 'include';
        options.headers = { Authorization: `bearer ${token}` };
    }
    return fetch(url, options).then((res) => {
        if (!res.ok) {
            throw new ServerError('Failed to fetch users', res.status);
        }
        return res.json();
    });
}

export function fetchRegularUsers(limit, search) {
    return fetchUsers(search, limit, 'user');
}

export function fetchAdmins(limit, search, token) {
    return fetchUsers(search, limit, 'admin', token);
}

export function fetchBannedUsers(limit, search, token) {
    return fetchUsers(search, limit, 'banned', token);
}

export function fetchAllUsers(limit, search, token) {
    return fetchUsers(search, limit, 'all', token);
}

export function updateUserRole(id, action, token) {
    return fetch(API_URL + `/user/${id}/${action}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if (!res.ok) {
            throw new ServerError('Failed to update user role', res.status);
        }
        return res.json();
    });
}

export function submitDeleteUser(id, token) {
    return fetch(API_URL + `/user/${id}/delete`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `bearer ${token}` }
    }).then((res) => {
        if (!res.ok) {
            throw new ServerError('Failed to delete user', res.status);
        }
        return res.json();
    });
}
