import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ImageInput } from './ImageInput';
import { useParams } from 'react-router-dom';
import '../styles/editpost.css';
import { useAuth } from '../hooks/useAuth';
import { submitImageUpload } from '../api/image';
import { fetchPost, submitEditPost } from '../api/post';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSmartTextarea } from '../hooks/useSmartTextarea';
import { EditorComponent } from './EditorComponent';

const formDefaultValues = {
    title: '',
    summary: '',
    image: {
        url: '',
        file: null
    },
    text: ''
};

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

    function handlePostSave(formData) {
        if (isSubmitting || disabled) return;
        const dirtyKeys = Object.keys(dirtyFields);
        if (dirtyKeys.length === 0) return;
        const newFormData = new FormData();
        dirtyKeys.forEach((key) => {
            const value = key === 'image' ? formData[key].file : formData[key];
            newFormData.append(key, value);
        });

        return submitEditPost(id, newFormData, encodedToken).catch((e) => {
            console.log(e);
        });
    }

    const {
        register,
        reset,
        control,
        formState: { isSubmitting, disabled, dirtyFields },
        handleSubmit,
        setValue,
        getValues
    } = useForm({
        defaultValues: formDefaultValues
    });

    useEffect(() => {
        if (post) {
            reset({
                title: post.title,
                summary: post.summary,
                image: {
                    url: `http://localhost:3000${post.image}`,
                    file: null
                },
                text: post.text
            });
        }
    }, [post, reset]);

    const textareaRef = useRef(null);
    const { registerTextarea } = useSmartTextarea(
        textareaRef,
        getValues().summary,
        setValue,
        register
    );

    if (isLoading) return <p>loading...</p>;
    if (error) return <p>There was an error loading the post</p>;
    return (
        <>
            <form
                className="post-form flex-col"
                onSubmit={handleSubmit(handlePostSave)}
            >
                <section>
                    <div className="flex-col post-headings">
                        <input
                            className="post-title-input"
                            type="text"
                            defaultValue={post.title}
                            placeholder="Post title"
                            {...register('title')}
                        ></input>
                        <textarea
                            rows={1}
                            className="post-description-input"
                            value={post.description}
                            placeholder="Description of the post"
                            {...registerTextarea}
                            ref={textareaRef}
                        ></textarea>
                    </div>
                </section>
                <section>
                    <h2 className="section-title">Thumbnail</h2>
                    <ImageInput control={control}></ImageInput>
                </section>
                <section>
                    <h2 className="section-title">Post content</h2>
                    <EditorComponent control={control}></EditorComponent>
                </section>
                <button className="save-post-button">Save</button>
            </form>
            <section>
                <h2 className="section-title">Actions</h2>
                <button>Publish post</button>
                <button>Delete post</button>
            </section>
        </>
    );
}
