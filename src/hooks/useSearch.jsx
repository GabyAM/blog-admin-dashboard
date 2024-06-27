import { useContext } from 'react';
import { SearchContext } from '../context/search';

export function useSearch() {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error("Can't use context outside of scope");
    }

    return context;
}
