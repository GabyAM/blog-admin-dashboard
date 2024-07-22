import API_URL from '../constants';

export function submitLogin(formData) {
    return fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
    }).then((res) => {
        if (!res.ok && res.status === 500) {
            throw new Error('');
        }
        return res.json();
    });
}
