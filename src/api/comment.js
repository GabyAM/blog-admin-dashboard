import { ServerError } from '../utils/error';
import { API_URL } from '../constants';

export function fetchComments(pageParam, limit, search) {
    let url = API_URL + `/comments?limit=${limit}`;
    if (pageParam)
        url += `&lastId=${pageParam._id}&lastCreatedAt=${pageParam.createdAt}`;
    if (search) {
        url += `&search=${search}`;
    }
    return fetch(url).then((res) => {
        if (!res.ok) {
            throw new ServerError('Failed to fetch comments', res.status);
        }
        return res.json();
    });
}

export function submitEditComment(id, text, token) {
    return fetch(API_URL + `/comment/${id}/update`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`
        },
        body: JSON.stringify({ text })
    }).then((res) => {
        if (!res.ok) {
            throw new ServerError('Failed to edit comment', res.status);
        }
        return res.json();
    });
}

export function submitDeleteComment(id, token) {
    return fetch(API_URL + `/comment/${id}/delete`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`
        }
    }).then((res) => {
        if (!res.ok) {
            throw new ServerError('Failed to delete comment', res.status);
        }
        return res.json();
    });
}
