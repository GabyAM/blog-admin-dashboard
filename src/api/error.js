import API_URL from '../constants';

export function submitErrorLog(error) {
    return fetch(API_URL + '/error/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error.message, stack: error.stack })
    }).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
    });
}
