import { Fragment, useCallback, useEffect, useState } from 'react';
import '../styles/popupmenu.css';
import { useClickOutside } from '../hooks/useClickOutside';

export function PopupMenu({ children, onClickOutside }) {
    const ref = useClickOutside(onClickOutside);
    const [initialOffset, setInitialOffset] = useState(null);
    const [position, setPosition] = useState('hidden'); // hidden || offscreen || left || right
    const handlePositionMenu = useCallback(() => {
        if (ref.current) {
            if (!initialOffset && position === 'hidden') {
                setInitialOffset(ref.current.getBoundingClientRect().left);
                setPosition('offscreen');
            } else {
                const width = ref.current.getBoundingClientRect().width;
                const shouldBeLeft =
                    initialOffset + width >
                    document.documentElement.clientWidth;
                setPosition((prev) => {
                    const newPosition = shouldBeLeft ? 'left' : 'right';
                    if (newPosition !== prev) return newPosition;
                    return prev;
                });
            }
        }
    }, [ref, initialOffset, position]);
    useEffect(() => {
        handlePositionMenu();
    }, [ref, handlePositionMenu]);
    useEffect(() => {
        window.addEventListener('resize', handlePositionMenu);
        return () => window.removeEventListener('resize', handlePositionMenu);
    }, [handlePositionMenu]);

    const filteredChildren = children.filter((children) => children !== false);
    return (
        <div ref={ref} className={`popup-menu ${position}`}>
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
