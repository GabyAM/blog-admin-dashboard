import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { ImageInput } from './ImageInput';
import { useFetchData } from '../hooks/UseFetchData';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export function EditPost() {
    const { id } = useParams();
    const {
        data: post,
        loading,
        error
    } = useFetchData(`http://localhost:3000/post/${id}`);

    const { encodedToken: token } = useAuth();

    const editorRef = useRef(null);

    const [inputs, setInputs] = useState({
        postTitle: '',
        postDescription: '',
        postThumbnail: {
            url: '',
            file: null
        },
        postContent: ''
    });

    useEffect(() => {
        if (post) {
            setInputs({
                postTitle: post.title,
                postDescription: post.summary,
                postThumbnail: {
                    url: `http://localhost:3000${post.image}`,
                    file: null
                },
                postContent: post.text
            });
        }
    }, [post]);

    function handleTextareaInput(e) {
        const textarea = e.target;

        const zoom = window.innerWidth / window.outerWidth;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    function handleImageUpload(blobInfo) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', blobInfo.blob(), blobInfo.filename());
            fetch(`http://localhost:3000/image/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Error at image upload');
                    }
                    return res.json();
                })
                .then((data) => {
                    resolve(`http://localhost:3000${data.url}`);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    function onInputChange(name, value) {
        setInputs({
            ...inputs,
            [name]: value
        });
    }

    async function handlePostSave() {
        const formData = new FormData();
        formData.append('title', inputs.postTitle);
        formData.append('summary', inputs.postDescription);
        formData.append('text', editorRef.current.getContent());
        if (inputs.postThumbnail.file) {
            // only true when the image hasn't been changed
            formData.append('image', inputs.postThumbnail.file);
        }
        try {
            const res = await fetch(`http://localhost:3000/post/${id}/update`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
                headers: {
                    Authorization: `bearer ${token}`
                }
            });
            if (!res.ok) {
                throw new Error('error on post update');
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            {loading ? (
                <p>loading...</p>
            ) : error ? (
                <p>There was an error loading the post</p>
            ) : (
                <>
                    <section>
                        <div className="flex-col post-headings">
                            <input
                                className="post-title-input"
                                type="text"
                                defaultValue={post.title}
                                placeholder="Post title"
                                onChange={(e) => {
                                    onInputChange('postTitle', e.target.value);
                                }}
                            ></input>
                            <textarea
                                rows={1}
                                onChange={(e) => {
                                    handleTextareaInput(e);
                                    onInputChange(
                                        'postDescription',
                                        e.target.value
                                    );
                                }}
                                className="post-description-input"
                                value={post.description}
                                placeholder="Description of the post"
                            ></textarea>
                        </div>
                    </section>
                    <section>
                        <h2 className="section-title">Thumbnail</h2>
                        <ImageInput
                            initialValue={inputs.postThumbnail.url}
                            onChange={(value) => {
                                onInputChange('postThumbnail', {
                                    url: URL.createObjectURL(value),
                                    file: value
                                });
                            }}
                        ></ImageInput>
                    </section>
                    <section>
                        <h2 className="section-title">Post content</h2>
                        <Editor
                            apiKey={process.env.TINYMCE_EDITOR_API_KEY}
                            onInit={(evt, editor) =>
                                (editorRef.current = editor)
                            }
                            onEditorChange={(value) => {
                                onInputChange('postContent', value);
                            }}
                            initialValue={post.text}
                            init={{
                                height: 500,
                                menubar:
                                    'file edit insert view format table tools help',
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
                                font_family_formats:
                                    'Poppins; Playfair Display',
                                content_style: `
                                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap');
                                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap')
                                    body { font-family: Poppins; font-size:14px; }`,
                                images_upload_handler: handleImageUpload
                            }}
                        />
                    </section>
                    <section>
                        <h2 className="section-title">Actions</h2>
                        <button>Publish post</button>
                        <button>Delete post</button>
                    </section>
                    <button
                        className="save-post-button"
                        onClick={handlePostSave}
                    >
                        Save
                    </button>
                </>
            )}
        </>
    );
}
