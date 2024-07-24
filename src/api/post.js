import { ServerError } from '../utils/error';
import { API_URL } from '../constants';

function fetchPosts(limit, pageParam, search, published, token) {
    let url = API_URL + `/posts?limit=${limit}`;
    if (published != null) {
        url += `&is_published=${published}`;
    }
    if (pageParam)
        url += `&lastId=${pageParam._id}&lastCreatedAt=${pageParam.createdAt}`;
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
            throw new ServerError('Failed to fetch posts', res.status);
        }
        return res.json();
    });
}

export function fetchPublishedPosts(limit, pageParam, search) {
    return fetchPosts(limit, pageParam, search, true);
}

export function fetchUnpublishedPosts(limit, pageParam, search, token) {
    return fetchPosts(limit, pageParam, search, false, token);
}

export function fetchAllPosts(limit, pageParam, search, token) {
    return fetchPosts(limit, pageParam, search, null, token);
}

export function fetchPost(id, token) {
    const options = {};
    if (token) {
        options.credentials = 'include';
        options.headers = { Authorization: `bearer ${token}` };
    }
    return fetch(API_URL + `/post/${id}`, options).then((res) => {
        if (!res.ok) {
            throw new ServerError('Failed to fetch post', res.status);
        }
        return res.json();
    });
}

function updatePostStatus(id, token, action) {
    return fetch(API_URL + `/post/${id}/${action}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Authorization: `bearer ${token}`
        }
    }).then((res) => {
        if (!res.ok && res.status !== 400) {
            throw new ServerError('failed to update post status', res.status);
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
    return fetch(API_URL + `/post/${id}/delete`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `bearer ${token}` }
    }).then((res) => {
        if (!res.ok) {
            throw new ServerError('Failed to delete post', res.status);
        }
        return res.json();
    });
}

export function submitEditPost(id, formData, token) {
    return fetch(API_URL + `/post/${id}/update`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
            Authorization: `bearer ${token}`
        }
    }).then((res) => {
        if (!res.ok && res.status !== 400) {
            throw new ServerError('Failed to edit post', res.status);
        }
        return res.json();
    });
}

export function submitCreatePost(formData, token) {
    return fetch(API_URL + '/post', {
        method: 'POST',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    }).then((res) => {
        if (!res.ok) {
            throw new ServerError('Failed at creating post', res.status);
        }
        return res.json();
    });
}
