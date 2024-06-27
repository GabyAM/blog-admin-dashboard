import { useEffect, useMemo, useRef, useState } from 'react';
import { AllPosts } from './AllPosts';
import { Comments } from './Comments';
import { Users } from './Users';
import '../styles/searchresults.css';
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

    const tabsRef = useRef({});
    const [underlineStyle, setUnderlineStyle] = useState({});
    const padding = 20;
    useEffect(() => {
        if (tabsRef.current) {
            setUnderlineStyle({
                width: tabsRef.current[currentTab].offsetWidth + padding,
                left: tabsRef.current[currentTab].offsetLeft - padding / 2
            });
        }
    }, [tabsRef, currentTab]);
    return (
        <>
            <ul className="tabs-list flex-row">
                {tabs.map((tab) => (
                    <li key={tab} className="tab-container">
                        <button
                            ref={(el) => (tabsRef.current[tab] = el)}
                            className={`tab ${currentTab === tab ? 'selected' : ''}`}
                            onClick={() => setCurrentTab(tab)}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
                <div className="tab-underline" style={underlineStyle}></div>
            </ul>
            {results[currentTab]}
        </>
    );
}
