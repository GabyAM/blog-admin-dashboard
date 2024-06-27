import { createContext, useEffect, useMemo, useState } from 'react';

export const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [search, setSearch] = useState('');

    const value = useMemo(() => ({ search, setSearch }), [search, setSearch]);
    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}
