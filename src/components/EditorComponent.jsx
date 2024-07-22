import { Editor } from '@tinymce/tinymce-react';
import { submitImageUpload } from '../api/image';
import { useAuth } from '../hooks/useAuth';
import { useController } from 'react-hook-form';
import { ErrorLabel } from './ErrorLabel';
import { useCallback, useEffect, useRef } from 'react';
import API_URL from '../constants';

export function EditorComponent({ control, rules = {}, error }) {
    const { encodedToken } = useAuth();
    function handleImageUpload(blobInfo) {
        const formData = new FormData();
        formData.append('image', blobInfo.blob(), blobInfo.filename());
        return submitImageUpload(formData, encodedToken)
            .then((data) => {
                return API_URL + data.url;
            })
            .catch((e) => {
                throw new Error('Error uploading image');
            });
    }

    const {
        field: { onChange, ref, value, onBlur },
        formState: { defaultValues }
    } = useController({ control, name: 'text', rules });

    const handleEditorChange = useCallback(
        (text) => {
            const formattedHtml = text.replaceAll('\n', '\r\n');
            if (editorRef.current && value.html !== formattedHtml) {
                const formattedText = editorRef.current.getContent({
                    format: 'text'
                });
                onChange({
                    html: formattedHtml,
                    formatted: formattedText
                });
            }
        },
        [onChange, value]
    );

    const editorRef = useRef(null);
    useEffect(() => {
        if (ref) {
            ref.current = editorRef.current;
        }
    }, [ref]);

    // i wanted the editor to focus on error but i really don't know how :(
    return (
        <>
            <Editor
                apiKey={process.env.TINYMCE_EDITOR_API_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={defaultValues.text.html}
                onEditorChange={handleEditorChange}
                onBlur={onBlur}
                value={value.html}
                ref={ref}
                init={{
                    height: 500,
                    menubar: 'file edit insert view format table tools help',
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'code',
                        'help',
                        'wordcount'
                    ],
                    toolbar:
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help' +
                        'image' +
                        'fontselect',
                    font_family_formats: 'Poppins; Playfair Display',
                    content_style: `
                                            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap');
                                            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap')
                                            body { font-family: Poppins; font-size:14px; }`,
                    images_upload_handler: handleImageUpload,
                    element_format: 'xhtml',
                    entity_encoding: 'raw'
                }}
            />
            {error && <ErrorLabel>{error}</ErrorLabel>}
        </>
    );
}
