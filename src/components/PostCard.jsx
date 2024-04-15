import { Link } from 'react-router-dom';
import he from 'he';
import '../styles/postcard.css';

export function PostCard({ post, onToggleState }) {
    return (
        <div className="post-card">
            <div className="main-section">
                <div className="post-thumbnail">
                    <img src={`http://localhost:3000${post.image}`}></img>
                </div>
                <div className="text-section flex-col">
                    <h2 className="title-primary">{he.decode(post.title)}</h2>
                    <p>{he.decode(post.summary)}</p>
                </div>
            </div>
            <div className="actions flex-row">
                <button className="action-button red-outline">Delete</button>
                <Link
                    className="action-button green-outline"
                    to={`/post/${post._id}`}
                >
                    Edit
                </Link>
                {post.is_published ? (
                    <button
                        className="action-button secondary-button"
                        onClick={(e) => onToggleState(e.target, post._id)}
                    >
                        Unpublish
                    </button>
                ) : (
                    <button
                        className="action-button primary-button"
                        onClick={(e) => onToggleState(e.target, post._id)}
                    >
                        Publish
                    </button>
                )}
            </div>
        </div>
    );
}
