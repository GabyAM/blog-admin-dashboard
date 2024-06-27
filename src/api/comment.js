export function fetchComments(pageParam, limit, search) {
    let url = `http://localhost:3000/comments?limit=${limit}`;
    if (pageParam)
        url += `&lastId=${pageParam._id}&lastCreatedAt=${pageParam.createdAt}`;
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

export function submitEditComment(id, text, token) {
    return fetch(`http://localhost:3000/comment/${id}/update`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`
        },
        body: JSON.stringify({ text })
    }).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
        return res.json();
    });
}

export function submitDeleteComment(id, token) {
    return fetch(`http://localhost:3000/comment/${id}/delete`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`
        }
    }).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
        return res.json();
    });
}
