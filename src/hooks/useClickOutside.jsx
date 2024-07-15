import { useEffect, useRef, useState } from 'react';

export function useClickOutside(onClickOutside) {
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
    }, [isMounted, onClickOutside]);
    return ref;
}
