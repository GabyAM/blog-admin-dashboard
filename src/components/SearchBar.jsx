import { useEffect, useState } from 'react';
import { useSearch } from '../hooks/useSearch';

export function SearchBar() {
    const { setSearch: setContextSearch } = useSearch();

    const [search, setSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setContextSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="main-search-bar"
            type="text"
            placeholder="Search posts, users, comments"
        ></input>
    );
}
