import '../styles/errorcatcher.css';
import React, { useEffect, useState } from 'react';
import { useRouteError } from 'react-router-dom';
import { submitErrorLog } from '../api/error';

export function ErrorCatcher() {
    const [retries, setRetries] = useState(0);
    const [sent, setSent] = useState(false);
    const error = useRouteError();
    useEffect(() => {
        if (error && !sent && retries < 3) {
            submitErrorLog(error)
                .then(() => {
                    setRetries(0);
                    setSent(true);
                })
                .catch((e) => {
                    setRetries((prev) => prev + 1);
                });
        }
    }, [error, retries, sent]);
    return (
        <div className="error-background">
            <a href="/">
                <img src="/logo_alternative.png"></img>
            </a>
            <div className="main-error-card">
                <h1>Oops...</h1>
                <p>
                    An unexpected error happened.
                    <br />
                    Sorry about that!
                </p>
            </div>
        </div>
    );
}
