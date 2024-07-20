import { Link, useNavigate } from 'react-router-dom';
import he from 'he';
import '../styles/postcard.css';
import { useState } from 'react';
import {
    DeleteIcon,
    EditIcon,
    PublishIcon,
    UnpublishIcon,
    VerticalDotsIcon
} from './Icons';
import { PopupMenu } from './PopupMenu';
import { useSearch } from '../hooks/useSearch';

export function PostCard({ post, onToggleState, onDelete }) {
    const navigate = useNavigate();
    const { setSearch } = useSearch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className={`post-card ${post.isPending ? 'pending' : ''}`}>
            <div className="post-thumbnail">
                <img src={`http://localhost:3000${post.image}`}></img>
            </div>
            <div className="text-section flex-col">
                <h2 className="title-primary">{he.decode(post.title)}</h2>
                <p>{he.decode(post.summary)}</p>
            </div>
            <div className="options-section">
                <button
                    disabled={post.isPending}
                    onClick={() => setIsMenuOpen(true)}
                    className="icon-container more-button"
                >
                    <VerticalDotsIcon></VerticalDotsIcon>
                </button>
                {isMenuOpen && (
                    <PopupMenu onClickOutside={() => setIsMenuOpen(false)}>
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                onToggleState(post._id, post.is_published);
                            }}
                            className="popup-menu-option"
                        >
                            {post.is_published ? (
                                <>
                                    <UnpublishIcon></UnpublishIcon>
                                    <span>Unpublish</span>
                                </>
                            ) : (
                                <>
                                    <PublishIcon></PublishIcon>
                                    <span>Publish</span>
                                </>
                            )}
                        </button>
                        <button
                            className="popup-menu-option"
                            onClick={() => {
                                navigate(`/post/${post._id}`);
                                setSearch('');
                            }}
                        >
                            <EditIcon></EditIcon>
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                onDelete(post._id);
                            }}
                            className="popup-menu-option"
                        >
                            <DeleteIcon></DeleteIcon>
                            <span>Delete</span>
                        </button>
                    </PopupMenu>
                )}
            </div>
        </div>
    );
}
