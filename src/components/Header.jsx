import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { useAuth } from '../hooks/useAuth';

export function Header() {
    const navigate = useNavigate();
    const { token: currentUser, removeToken } = useAuth();
    return (
        <header>
            <button
                className="new-post-button"
                onClick={() => navigate('/post/create')}
            >
                New post
            </button>
            <div className="main-search-bar-section">
                <input
                    className="main-search-bar"
                    type="text"
                    placeholder="Search posts, users, comments"
                ></input>
            </div>
            <div className="user-card"></div>
        </header>
    );
}
