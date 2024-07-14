import React, { useEffect, useState } from 'react';
import { ImageInput } from './ImageInput';
import '../styles/postform.css';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { EditorComponent } from './EditorComponent';
import { SmartTextarea } from './SmartTextarea';
import { ErrorLabel } from './ErrorLabel';
import { PostFormActions } from './PostFormActions';

const formDefaultValues = {
    title: '',
    summary: '',
    image: {
        url: '/post_thumbnail_placeholder.png',
        file: null
    },
    text: {
        html: '',
        formatted: ''
    }
};
function validateImage(file) {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) return 'File exceeds max size';

    const acceptedTypes = /image\/(jpeg|jpg|png|gif|webp)/;

    if (!acceptedTypes.test(file.type)) {
        return 'Invalid file type';
    }
}

function validate(values) {
    const errors = {};
    if (!values.title) {
        errors.title = {
            type: 'required',
            message: 'Post title is required'
        };
    } else if (values.title.length < 8) {
        errors.title = {
            type: 'minLength',
            message: "Post title can't be shorter that 8 characters"
        };
    } else if (values.title.length > 80) {
        errors.title = {
            type: 'maxLength',
            message: "Post title can't be longer that 80 characters"
        };
    }

    if (!values.summary) {
        errors.summary = {
            type: 'required',
            message: 'Description is required'
        };
    } else if (values.summary.length < 8) {
        errors.summary = {
            type: 'minLength',
            message: "Post description can't be shorter that 8 characters"
        };
    } else if (values.summary.length > 80) {
        errors.summary = {
            type: 'maxLenght',
            message: "Post description can't be longer that 80 characters"
        };
    }

    if (values.text.formatted && values.text.formatted.length < 50) {
        errors.text = {
            type: 'minLength',
            message: 'Post content must contain at least than 50 characters'
        };
    }

    if (values.image.file) {
        const imageError = validateImage(values.image.file);
        if (imageError) {
            errors.image = {
                type: 'validate',
                message: imageError
            };
        }
    }

    return errors;
}

export function PostForm({
    post,
    onSubmit,
    onSuccess,
    onDelete,
    onStatusUpdate
}) {
    const { encodedToken } = useAuth();

    function handleFormSubmit(formData) {
        if (isSubmitting || disabled) return;
        const dirtyKeys = Object.keys(dirtyFields);
        if (dirtyKeys.length === 0 && post) return;
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
                if (data.errors) {
                    Object.keys(data.errors).forEach((key) => {
                        setError(key, {
                            type: 'server',
                            message: data.errors[key]
                        });
                    });
                } else return onSuccess(data.post);
            })
            .catch((e) => {
                setError('root.serverError', {
                    message: 'There was an error saving the post'
                });
                setTimeout(() => {
                    clearErrors('root');
                }, 1500);
            });
    }

    const {
        register,
        reset,
        control,
        formState: {
            isSubmitting,
            defaultValues,
            isDirty,
            disabled,
            dirtyFields,
            errors
        },
        handleSubmit,
        getValues,
        watch,
        setError,
        clearErrors
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

    const [isValid, setIsValid] = useState(null);
    useEffect(() => {
        function handleValidation(values) {
            const errors = validate(values);
            if (post) {
                if (post.is_published) {
                    Object.keys(values).forEach((name) => {
                        if (errors[name]) {
                            setError(name, errors[name]);
                        } else {
                            clearErrors(name);
                        }
                    });
                } else if (errors.image) setError('image', errors.image);
            }
            setIsValid((prev) => {
                const newValue = Object.keys(errors).length === 0;
                if (newValue !== prev) {
                    return newValue;
                }
                return prev;
            });
        }
        const subscription = watch((values) => handleValidation(values));

        if (isValid === null) {
            handleValidation(getValues());
        }

        return () => subscription.unsubscribe();
    }, [clearErrors, getValues, isValid, post, setError, watch]);

    return (
        <>
            <button onClick={() => console.log(getValues())}>getValues</button>
            <form className="post-form flex-col">
                <section>
                    <div className="flex-col post-headings">
                        <div className="input-container">
                            <input
                                className="post-title-input"
                                type="text"
                                placeholder="Post title"
                                {...register('title', {})}
                            ></input>
                            {errors?.title && (
                                <ErrorLabel>{errors.title.message}</ErrorLabel>
                            )}
                        </div>
                        <SmartTextarea
                            control={control}
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
                        error={errors?.text?.message ?? null}
                    ></EditorComponent>
                </section>
                <button
                    type="button"
                    className={
                        'save-post-button large rounded primary-button' +
                        ` ${!isDirty || isSubmitting ? 'pending' : ''} ${errors?.root ? 'error' : ''}`
                    }
                    onClick={() => {
                        if (
                            isDirty &&
                            !isSubmitting &&
                            !(errors && errors.root)
                        ) {
                            handleSubmit(handleFormSubmit)();
                        }
                    }}
                    disabled={
                        !isDirty || isSubmitting || (errors && errors.root)
                    }
                >
                    <span>Saving</span>
                    <span>
                        {isSubmitting
                            ? 'Saving'
                            : errors?.root
                              ? 'Error'
                              : 'Save'}
                    </span>
                </button>
            </form>
            {post && (
                <PostFormActions
                    updateAction={post.is_published ? 'unpublish' : 'publish'}
                    canPublish={isValid && !isDirty}
                    disabledReason={
                        !isValid
                            ? "The post doesn't meet the requirements to be published"
                            : isDirty
                              ? 'The post has to be saved first'
                              : ''
                    }
                    onUpdateStatus={onStatusUpdate}
                    onDelete={onDelete}
                ></PostFormActions>
            )}
        </>
    );
}
