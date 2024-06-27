import { useMemo, useState } from 'react';
import { AllPosts } from './AllPosts';
import { Comments } from './Comments';
import { Users } from './Users';
import { useSearch } from '../hooks/useSearch';

const tabs = ['Posts', 'Users', 'Comments'];
export function SearchResults() {
    const { search } = useSearch();
    const [currentTab, setCurrentTab] = useState('Posts');

    const results = useMemo(() => {
        return {
            Posts: <AllPosts></AllPosts>,
            Comments: <Comments></Comments>,
            Users: <Users></Users>
        };
    }, [search]);

    return (
        <>
            <ul className="tabs-list flex-row">
                {tabs.map((tab) => (
                    <li key={tab} className="tab-container">
                        <button
                            className="tab"
                            onClick={() => setCurrentTab(tab)}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>
            {results[currentTab]}
        </>
    );
}
