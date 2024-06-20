import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { ImageInput } from './ImageInput';
import { useParams } from 'react-router-dom';
import '../styles/editpost.css';
import { useAuth } from '../hooks/useAuth';
import { submitImageUpload } from '../api/image';
import { fetchPost, submitEditPost } from '../api/post';
import { useQuery } from '@tanstack/react-query';
export function EditPost() {
    const { id } = useParams();

    const { encodedToken } = useAuth();
    const {
        data: post,
        isLoading,
        error
    } = useQuery({
        queryKey: [`post_${id}`],
        queryFn: () => fetchPost(id, encodedToken)
    });

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
        submitEditPost(id, formData, encodedToken).catch((e) => {
            console.log(e);
        });
    }

    return (
        <>
            {isLoading ? (
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
