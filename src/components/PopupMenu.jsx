import { Fragment, useEffect, useRef, useState } from 'react';
import '../styles/popupmenu.css';

export function PopupMenu({ children, onClickOutside }) {
    const ref = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                onClickOutside();
            }
        }

        if (isMounted) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
            setIsMounted(false);
        };
    }, [isMounted]);
    return (
        <div ref={ref} className="popup-menu">
            {children.map((element, index) => (
                <Fragment key={index}>
                    {element}
                    {index < children.length - 1 && (
                        <div className="popup-menu-separator"></div>
                    )}
                </Fragment>
            ))}
        </div>
    );
}
