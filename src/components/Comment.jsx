import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export function Comment({ comment, onEdit }) {
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
                    </div>
                    <div
                        className={`comment-actions ${isEditing ? 'edit-mode' : ''}`}
                    >
                        {isEditing ? (
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
                        ) : (
                            <>
                                <button
                                    disabled={comment.isPending}
                                    className="action-button delete-button red-outline"
                                >
                                    Delete
                                </button>
                                <button
                                    disabled={comment.isPending}
                                    onClick={() => setIsEditing(true)}
                                    className="action-button edit-button green-outline"
                                >
                                    Edit
                                </button>
                                <Link
                                    className={`action-button primary-button replies-button ${comment.isPending ? 'disabled' : ''}`}
                                >
                                    See replies
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}