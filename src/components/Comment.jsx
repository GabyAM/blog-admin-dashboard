import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { DeleteIcon, EditIcon, VerticalDotsIcon } from './Icons';
import { PopupMenu } from './PopupMenu';

export function Comment({ comment, onEdit, onDelete }) {
    const text = useRef(null);
    const [commentText, setCommentText] = useState(comment.text);
    const [isOverflown, setIsOverflown] = useState(false);
    const [textHidden, setTextHidden] = useState(true);

    useEffect(() => {
        setCommentText(comment.text);
    }, [comment]);
    useEffect(() => {
        if (text.current) {
            const textHeight = text.current.getBoundingClientRect().height;
            setIsOverflown(textHeight > 160);
        }
    }, []);

    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div
            className={`comment-container-wrapper flex-col ${comment.isPending ? 'pending' : ''}`}
            key={comment._id}
        >
            <h3>
                {comment.parent_comment
                    ? `In response to a comment on post "${comment.post.title}"`
                    : `On post "${comment.post.title}"`}
            </h3>
            <div className="flex-col">
                <div className="comment-container flex-col">
                    <div
                        className={
                            'comment' +
                            (!textHidden || isEditing ? ' expanded' : '')
                        }
                    >
                        <div className="image-container">
                            <img src="/avatar.png"></img>
                        </div>
                        <div className="comment-text">
                            <span>{comment.user.name}</span>
                            {isEditing ? (
                                <textarea
                                    className="comment-content"
                                    defaultValue={commentText}
                                    rows={3}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                ></textarea>
                            ) : (
                                <>
                                    <p
                                        ref={text}
                                        className={`comment-content ${
                                            isOverflown && textHidden
                                                ? 'overflown'
                                                : ''
                                        }`}
                                    >
                                        {commentText}
                                    </p>
                                    {isOverflown && (
                                        <button
                                            className="toggle-comment-length"
                                            onClick={() =>
                                                setTextHidden(!textHidden)
                                            }
                                        >
                                            {textHidden
                                                ? 'Show more'
                                                : 'Show less '}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="comment-options-section">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="icon-container more-button"
                            >
                                <VerticalDotsIcon></VerticalDotsIcon>
                            </button>
                            {isMenuOpen && (
                                <PopupMenu
                                    onClickOutside={() => setIsMenuOpen(false)}
                                >
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="popup-menu-option"
                                    >
                                        <EditIcon></EditIcon>
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(comment._id);
                                            setIsMenuOpen(false);
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
                    {isEditing && (
                        <div
                            className={`comment-actions ${isEditing ? 'edit-mode' : ''}`}
                        >
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="action-button secondary-button"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit(comment._id, commentText);
                                        setIsEditing(false);
                                    }}
                                    className="action-button primary-button"
                                >
                                    Submit
                                </button>
                            </>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
