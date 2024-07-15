import { useEffect, useState } from 'react';
import { useSearch } from '../hooks/useSearch';

export function SearchBar() {
    const { search: contextSearch, setSearch: setContextSearch } = useSearch();

    const [search, setSearch] = useState('');

    useEffect(() => {
        setSearch((prev) => {
            if (contextSearch !== prev) {
                return contextSearch;
            }
            return prev;
        });
    }, [contextSearch, setSearch]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setContextSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search, setContextSearch]);

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
