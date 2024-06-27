import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import { useSearch } from '../hooks/useSearch';

const links = [
    { url: '/', title: 'Overview' },
    {
        url: '/posts',
        title: 'Posts',
        sections: [
            { url: '/posts/drafts', title: 'Drafts' },
            { url: '/posts/published', title: 'Published posts' }
        ]
    },
    {
        url: '/users',
        title: 'Users',
        sections: [
            { url: '/users/regular', title: 'Regular users' },
            { url: '/users/admin', title: 'Admin users' },
            { url: '/users/banned', title: 'Banned users' }
        ]
    },
    { url: '/comments', title: 'Comments' }
];
export function NavBar() {
    const { setSearch } = useSearch();
    return (
        <aside className="main-navbar flex-col">
            <div className="logo-container">
                <img src="/logo.png"></img>
            </div>
            <nav>
                <ul className="sections-list flex-col">
                    {links.map((link) => (
                        <li key={link.url} onClick={() => setSearch('')}>
                            <Link to={link.url}>{link.title}</Link>
                            {link.sections && (
                                <ul className="sub-sections-list">
                                    {link.sections.map((link) => (
                                        <li
                                            key={link.url}
                                            onClick={() => setSearch('')}
                                        >
                                            <Link to={link.url}>
                                                {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
