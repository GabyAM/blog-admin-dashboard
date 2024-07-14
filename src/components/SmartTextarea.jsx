import { useEffect, useImperativeHandle, useRef } from 'react';
import { useController } from 'react-hook-form';
import { ErrorLabel } from './ErrorLabel';

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

export function SmartTextarea({ control, rules = {}, error }) {
    const textareaRef = useRef(null);

    const {
        field: { ref, onChange, onBlur, value }
    } = useController({ name: 'summary', rules, control });

    function handleTextareaInput(e) {
        const { target: textarea } = e;
        adjustTextareaHeight(textarea);
        onChange(textarea.value);
    }
    useEffect(() => {
        if (textareaRef.current) {
            adjustTextareaHeight(textareaRef.current);
        }
    }, [value]);

    useImperativeHandle(ref, () => textareaRef.current);

    return (
        <>
            <textarea
                rows={1}
                className="post-description-input"
                ref={textareaRef}
                value={value}
                onChange={handleTextareaInput}
                onBlur={onBlur}
                placeholder="Description of the post"
            ></textarea>
            {error && <ErrorLabel>{error}</ErrorLabel>}
        </>
    );
}
