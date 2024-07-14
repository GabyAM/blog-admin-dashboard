import { useState } from 'react';
import { submitPublishPost, submitUnpublishPost } from '../api/post';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { InfoIcon } from './Icons';

export function PostFormActions({
    updateAction,
    canPublish,
    disabledReason,
    onUpdateStatus,
    onDelete
}) {
    const { id } = useParams();
    const { encodedToken } = useAuth();

    const [actionStatus, setActionStatus] = useState('idle');
    function handleUpdateStatus() {
        setActionStatus('loading');
        const updateFn =
            updateAction === 'publish'
                ? submitPublishPost
                : submitUnpublishPost;

        updateFn(id, encodedToken)
            .then((data) => {
                if (data.error) {
                    throw new Error('');
                }
                onUpdateStatus();
                setActionStatus('idle');
            })
            .catch(() => setActionStatus('error'));
    }

    return (
        <section className="post-form-actions">
            <h2 className="section-title">Actions</h2>
            <div className="post-form-actions-grid">
                {updateAction === 'unpublish' ? (
                    <button
                        onClick={handleUpdateStatus}
                        className={
                            'update-status-button medium tertiary-button rounded' +
                            ` ${actionStatus === 'loading' ? 'pending' : ''}`
                        }
                    >
                        {actionStatus === 'loading'
                            ? 'Unpublishing...'
                            : 'Unpublish'}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => {
                                if (canPublish) handleUpdateStatus();
                            }}
                            className={
                                'update-status-button medium primary-button rounded' +
                                ` ${!canPublish || actionStatus === 'loading' ? 'pending' : ''}`
                            }
                            disabled={!canPublish}
                        >
                            {actionStatus === 'loading'
                                ? 'Publishing...'
                                : 'Publish'}
                        </button>
                    </>
                )}

                <div className="info-label">
                    {updateAction === 'publish' && !canPublish && (
                        <>
                            <InfoIcon></InfoIcon>
                            <p>{disabledReason}</p>
                        </>
                    )}
                </div>

                <button
                    onClick={onDelete}
                    className="delete-button medium outlined-button-red rounded"
                >
                    Delete post
                </button>
            </div>
        </section>
    );
}
