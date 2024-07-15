import '../styles/deletepopup.css';
import { useState } from 'react';
import { ErrorLabel } from './ErrorLabel';
import { DeleteIcon } from './Icons';
import { useClickOutside } from '../hooks/useClickOutside';

export function DeletePopup({
    title,
    description,
    onDelete,
    onClickOutside,
    onSuccess
}) {
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const ref = useClickOutside(onClickOutside);
    function handleDelete() {
        if (isDeleting) return;
        setIsDeleting(true);
        setError(null);
        return onDelete()
            .then((res) => {
                if (res.error) {
                    throw new Error(res.error);
                }
                onSuccess();
                onClickOutside();
            })
            .catch((e) => setError(e.message))
            .finally(() => setIsDeleting(false));
    }
    return (
        <div className="popup-container">
            <div ref={ref} className="popup-card">
                <div className="popup-card-headings">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                <div>
                    <div className="popup-card-actions">
                        <button
                            onClick={() => onClickOutside()}
                            className="cancel-button medium outlined-button-900 grey-outline semi-rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleDelete()}
                            className={`delete-button medium semi-rounded ${isDeleting ? 'pending' : ''}`}
                        >
                            <DeleteIcon></DeleteIcon>
                            <span>Delete</span>
                        </button>
                    </div>
                    {error && <ErrorLabel>{error}</ErrorLabel>}
                </div>
            </div>
        </div>
    );
}
