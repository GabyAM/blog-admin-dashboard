export function submitErrorLog(error) {
    return fetch('http://localhost:3000/error/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error.message, stack: error.stack })
    }).then((res) => {
        if (!res.ok) {
            throw new Error('');
        }
    });
}
