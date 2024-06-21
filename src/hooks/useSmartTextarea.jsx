import { useEffect, useImperativeHandle } from 'react';

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

export function useSmartTextarea(textareaRef, value, setValue, register) {
    function handleTextareaInput(e) {
        adjustTextareaHeight(e.target);
        setValue('summary', e.target.value);
    }
    useEffect(() => {
        if (textareaRef.current) {
            adjustTextareaHeight(textareaRef.current);
        }
    }, [value]);
    const { ref, ...rest } = register('summary', {
        onChange: handleTextareaInput
    });
    useImperativeHandle(ref, () => textareaRef.current);

    return { registerTextarea: rest };
}
