import { ErrorIcon } from './Icons';
import '../styles/errorlabel.css';

export function ErrorLabel({ children }) {
    return (
        <div className="error-label flex-row">
            <ErrorIcon></ErrorIcon>
            <span>{children}</span>
        </div>
    );
}
