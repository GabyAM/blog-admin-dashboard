import React, { useEffect } from 'react';
import { ImageInput } from './ImageInput';
import { useNavigate } from 'react-router-dom';
import '../styles/editpost.css';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { EditorComponent } from './EditorComponent';
import { SmartTextarea } from './SmartTextarea';
import { ErrorLabel } from './ErrorLabel';

const formDefaultValues = {
    title: '',
    summary: '',
    image: {
        url: '',
        file: null
    },
    text: {
        html: '',
        formatted: ''
    }
};

export function PostForm({ post, rules, onSubmit, successUrl }) {
    const navigate = useNavigate();

    const { encodedToken } = useAuth();

    function handleFormSubmit(formData) {
        if (isSubmitting || disabled) return;
        const dirtyKeys = Object.keys(dirtyFields);
        if (dirtyKeys.length === 0) return;
        const newFormData = new FormData();
        dirtyKeys.forEach((key) => {
            let value;
            if (key === 'image') {
                value = formData[key].file;
            } else if (key === 'text') {
                value = formData[key].html;
            } else value = formData[key];
            newFormData.append(key, value);
        });

        return onSubmit(newFormData, encodedToken)
            .then((data) => {
                if (successUrl) {
                    return navigate(successUrl);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const {
        register,
        reset,
        control,
        formState: {
            isSubmitting,
            disabled,
            dirtyFields,
            defaultValues,
            errors
        },
        handleSubmit,
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
                text: {
                    html: post.text,
                    formatted: ''
                }
            });
        }
    }, [post, reset]);

    return (
        <>
            <button onClick={() => console.log(getValues())}>getValues</button>
            <form
                className="post-form flex-col"
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <section>
                    <div className="flex-col post-headings">
                        <div className="input-container">
                            <input
                                className="post-title-input"
                                type="text"
                                placeholder="Post title"
                                {...register('title', {
                                    ...(rules?.title ?? {})
                                })}
                            ></input>
                            {errors?.title && (
                                <ErrorLabel>{errors.title.message}</ErrorLabel>
                            )}
                        </div>
                        <SmartTextarea
                            control={control}
                            rules={rules?.summary ?? {}}
                            error={errors?.summary?.message ?? null}
                        ></SmartTextarea>
                    </div>
                </section>
                <section>
                    <h2 className="section-title">Thumbnail</h2>
                    <ImageInput
                        control={control}
                        error={errors?.image?.message ?? null}
                    ></ImageInput>
                </section>
                <section>
                    <h2 className="section-title">Post content</h2>
                    <EditorComponent
                        control={control}
                        rules={rules?.text ?? {}}
                        error={errors?.text?.message ?? null}
                    ></EditorComponent>
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
