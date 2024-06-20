export function submitImageUpload(formData, token) {
    return fetch(`http://localhost:3000/image/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
            Authorization: `bearer ${token}`
        }
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Error at image upload');
        }
        return res.json();
    });
}
