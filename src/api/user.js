function fetchUsers(search, limit = 6, role) {
    let url = `http://localhost:3000/users?limit=${limit}`;
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
    return fetch(url).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
        return res.json();
    });
}

export function fetchRegularUsers(limit, search) {
    return fetchUsers(search, limit, 'user');
}

// token
export function fetchAdmins(limit, search) {
    return fetchUsers(search, limit, 'admin');
}

// token
export function fetchBannedUsers(limit, search) {
    return fetchUsers(search, limit, 'banned');
}

// token
export function fetchAllUsers(limit, search) {
    return fetchUsers(search, limit, 'all');
}

export function updateUserRole(id, action, token) {
    return fetch(`http://localhost:3000/user/${id}/${action}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
        return res.json();
    });
}

export function submitDeleteUser(id, token) {
    return fetch(`http://localhost:3000/user/${id}/delete`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `bearer ${token}` }
    }).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
        return res.json();
    });
}
