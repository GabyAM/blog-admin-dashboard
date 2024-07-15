import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import '../styles/popupmenu.css';
import { useClickOutside } from '../hooks/useClickOutside';

export function PopupMenu({ children, onClickOutside }) {
    const ref = useClickOutside(onClickOutside);
    const [initialOffset, setInitialOffset] = useState(null);
    const [isLeft, setIsLeft] = useState(false);
    const handlePositionMenu = useCallback(() => {
        if (ref.current) {
            setInitialOffset((prev) => {
                if (prev === null) return ref.current.offsetLeft;
                return prev;
            });
            const width = ref.current.getBoundingClientRect().width;
            const shouldBeLeft =
                (initialOffset || ref.current.offsetLeft) + width >
                window.innerWidth;

            setIsLeft((prevIsLeft) => {
                if (prevIsLeft !== shouldBeLeft) {
                    return shouldBeLeft;
                }
                return prevIsLeft;
            });
        }
    }, [ref, initialOffset]);
    useEffect(() => {
        handlePositionMenu();
    }, [ref, handlePositionMenu]);
    useEffect(() => {
        window.addEventListener('resize', handlePositionMenu);
        return () => window.removeEventListener('resize', handlePositionMenu);
    }, [handlePositionMenu]);

    const filteredChildren = children.filter((children) => children !== false);
    return (
        <div
            ref={ref}
            className={`popup-menu ${!ref.current ? 'hidden' : ''} ${isLeft ? 'left' : ''}`}
        >
            {filteredChildren.length &&
                filteredChildren.map((element, index) => (
                    <Fragment key={index}>
                        {element}
                        {index < filteredChildren.length - 1 && (
                            <div className="popup-menu-separator"></div>
                        )}
                    </Fragment>
                ))}
        </div>
    );
}
