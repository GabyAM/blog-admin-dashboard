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
                <button className="post-delete-button">Delete</button>
                <Link
                    className="button-container post-edit-button"
                    to={`/post/${post._id}`}
                >
                    <button>Edit</button>
                </Link>
                {post.is_published ? (
                    <button
                        className="post-unpublish-button"
                        onClick={(e) => onToggleState(e.target, post._id)}
                    >
                        Unpublish
                    </button>
                ) : (
                    <button
                        className="post-publish-button"
                        onClick={(e) => onToggleState(e.target, post._id)}
                    >
                        Publish
                    </button>
                )}
            </div>
        </div>
    );
}
