import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useFetchData(url) {
    const { encodedToken: token } = useAuth();

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const headers = {};
            if (token) {
                headers.Authorization = `bearer ${token}`;
            }
            const response = await fetch(url, {
                credentials: 'include',
                headers
            });
            if (!response.ok) {
                throw new Error('data fetch failed');
            }
            const newData = await response.json();
            setData(newData);
        } catch (e) {
            setError(e);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, fetchData };
}
