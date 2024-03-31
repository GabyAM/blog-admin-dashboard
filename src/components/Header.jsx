import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { useAuth } from '../hooks/useAuth';

export function Header() {
    const navigate = useNavigate();
    const { encodedToken: token } = useAuth();
    async function handleCreatePost() {
        try {
            const response = await fetch('http://localhost:3000/post', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed at creating post');
            }
            const data = await response.json();
            navigate(`/post/${data.post._id}`);
        } catch (e) {
            console.error(e);
        }
    }
    return (
        <header>
            <button className="new-post-button" onClick={handleCreatePost}>
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
