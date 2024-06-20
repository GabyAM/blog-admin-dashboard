function fetchPosts(limit, pageParam, published, token) {
    let url = `http://localhost:3000/posts?is_published=${published}&limit=${limit}`;
    if (pageParam)
        url += `&lastId=${pageParam._id}&lastCreatedAt=${pageParam.createdAt}`;
    const options = {};
    if (token) {
        options.credentials = 'include';
        options.headers = { Authorization: `bearer ${token}` };
    }
    return fetch(url, options).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
        return res.json();
    });
}

export function fetchPublishedPosts(limit, pageParam) {
    return fetchPosts(limit, pageParam, true);
}

export function fetchUnpublishedPosts(limit, pageParam, token) {
    return fetchPosts(limit, pageParam, false, token);
}

export function fetchPost(id, token) {
    const options = {};
    if (token) {
        options.credentials = 'include';
        options.headers = { Authorization: `bearer ${token}` };
    }
    return fetch(`http://localhost:3000/post/${id}`).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
        return res.json();
    });
}

function updatePostStatus(id, token, action) {
    return fetch(`http://localhost:3000/post/${id}/${action}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Authorization: `bearer ${token}`
        }
    }).then((res) => {
        if (!res.ok && res.status === 500) {
            throw new Error('');
        }
        return res.json();
    });
}

export function submitUnpublishPost(id, token) {
    return updatePostStatus(id, token, 'unpublish');
}

export function submitPublishPost(id, token) {
    return updatePostStatus(id, token, 'publish');
}

export function submitDeletePost(id, token) {
    return fetch(`http://localhost:3000/post/${id}/delete`, {
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

export function submitEditPost(id, formData, token) {
    return fetch(`http://localhost:3000/post/${id}/update`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
            Authorization: `bearer ${token}`
        }
    }).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
        return res.json();
    });
}
