import '../styles/infocard.css';
import { ErrorIcon, InfoIcon } from './Icons';

export function InfoCard({ type, centered = false, error }) {
    return (
        <div
            className={`info-card-container flex-row ${type === 'serverError' ? 'server-error' : 'no-results'} ${centered ? 'centered' : ''}`}
        >
            {type === 'serverError' ? (
                <>
                    <ErrorIcon
                        width="4em"
                        height="4em"
                        type="outlined"
                    ></ErrorIcon>
                    <span>
                        There was an error trying to load this data, please
                        retry later.
                        <br />
                        {error.status && `Error code: ${error.status}`}
                    </span>
                </>
            ) : (
                <>
                    <InfoIcon width="4em" height="4em"></InfoIcon>
                    <span>No results</span>
                </>
            )}
        </div>
    );
}
