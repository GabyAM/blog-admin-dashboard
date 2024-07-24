import { ServerError } from '../utils/error';
import { API_URL } from '../constants';

export function submitImageUpload(formData, token) {
    return fetch(API_URL + `/image/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
            Authorization: `bearer ${token}`
        }
    }).then((res) => {
        if (!res.ok) {
            throw new ServerError('Error at image upload', res.status);
        }
        return res.json();
    });
}
