import { Editor } from '@tinymce/tinymce-react';
import { submitImageUpload } from '../api/image';
import { useAuth } from '../hooks/useAuth';
import { useController } from 'react-hook-form';

export function EditorComponent({ control }) {
    const { encodedToken } = useAuth();
    function handleImageUpload(blobInfo) {
        const formData = new FormData();
        formData.append('image', blobInfo.blob(), blobInfo.filename());
        return submitImageUpload(formData, encodedToken)
            .then((data) => {
                return `http://localhost:3000${data.url}`;
            })
            .catch((e) => {
                throw new Error('Error uploading image');
            });
    }
    const {
        field: { onChange, ...field },
        formState: { defaultValues }
    } = useController({ control, name: 'text' });
    return (
        <Editor
            apiKey={process.env.TINYMCE_EDITOR_API_KEY}
            initialValue={defaultValues.text}
            onEditorChange={onChange}
            {...field}
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
                    'table',
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
                images_upload_handler: handleImageUpload
            }}
        />
    );
}
