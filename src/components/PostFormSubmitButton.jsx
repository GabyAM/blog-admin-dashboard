export function PostFormSubmitButton({
    disabled,
    onSubmit,
    isError,
    children
}) {
    return (
        <button
            type="button"
            className={
                'save-post-button large rounded primary-button' +
                ` ${isError ? 'error' : disabled ? 'pending' : ''}`
            }
            onClick={() => {
                if (!disabled) {
                    onSubmit();
                }
            }}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
