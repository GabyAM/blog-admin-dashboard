import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/editpost.css';
import { useAuth } from '../hooks/useAuth';
import { fetchPost, submitEditPost } from '../api/post';
import { useQuery } from '@tanstack/react-query';
import { PostForm } from './PostForm';

const publishedValidations = {
    title: {
        minLength: {
            value: 8,
            message: "Post title can't be shorter that 8 characters"
        },
        maxLength: {
            value: 80,
            message: "Post title can't be longer than 80 characters"
        }
    },
    summary: {
        minLength: {
            value: 8,
            message: "Description can't be shorter that 8 characters"
        },
        maxLength: {
            value: 160,
            message: "Description can't be longer than 80 characters"
        }
    },
    text: {
        validate: (value) => {
            if (value.formatted) {
                return (
                    value.formatted.length > 50 ||
                    'Post content must contain more than 50 characters'
                );
            }
            return true;
        }
    }
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

    if (isLoading) return <p>loading...</p>;
    if (error) return <p>There was an error loading the post</p>;
    return (
        <PostForm
            post={post}
            rules={post.is_published ? publishedValidations : {}}
            onSubmit={(formData, token) => submitEditPost(id, formData, token)}
        ></PostForm>
    );
}
