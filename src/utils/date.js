const units = [
    { name: 'second', seconds: 1 },
    { name: 'minute', seconds: 60 },
    { name: 'hour', seconds: 60 * 60 },
    { name: 'day', seconds: 60 * 60 * 24 },
    { name: 'week', seconds: 60 * 60 * 24 * 7 },
    { name: 'month', seconds: 60 * 60 * 24 * (365 / 12) },
    { name: 'year', seconds: 60 * 60 * 24 * 365 }
];

export function formatDateToDistance(date) {
    const currentDate = new Date();
    const inputDate = new Date(date);
    const difference = Math.floor((currentDate - inputDate) / 1000);
    for (let i = units.length - 1; i >= 0; i--) {
        if (difference >= units[i].seconds) {
            const count = Math.floor(difference / units[i].seconds);
            return (
                count + ' ' + units[i].name + (count !== 1 ? 's' : '') + ' ago'
            );
        }
    }
    return 'just now';
}
