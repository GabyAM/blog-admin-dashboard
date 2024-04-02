import { Link } from 'react-router-dom';
import he from 'he';

export function PostCard({ post }) {
    return (
        <div className="post-card">
            <div className="main-section">
                <div className="post-thumbnail">
                    <img></img>
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
                <button className="post-publish-button">Publish</button>
            </div>
        </div>
    );
}
