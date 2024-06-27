import { Fragment, useEffect, useRef, useState } from 'react';
import '../styles/popupmenu.css';

export function PopupMenu({ children, onClickOutside }) {
    const ref = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLeft, setIsLeft] = useState(false);
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
    function handlePositionMenu() {
        if (ref.current) {
            const width = ref.current.getBoundingClientRect().width;
            const shouldBeLeft =
                ref.current.offsetLeft + width > window.innerWidth;

            setIsLeft((prevIsLeft) => {
                if (prevIsLeft !== shouldBeLeft) {
                    return shouldBeLeft;
                }
                return prevIsLeft;
            });
        }
    }
    useEffect(() => {
        handlePositionMenu();
    }, [ref.current]);
    useEffect(() => {
        window.addEventListener('resize', handlePositionMenu);
        return () => window.removeEventListener('resize', handlePositionMenu);
    }, []);

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
