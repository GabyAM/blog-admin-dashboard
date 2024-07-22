import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchPost, submitDeletePost, submitEditPost } from '../api/post';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PostForm } from './PostForm';
import { DeletePopup } from './DeletePopup';
import { InfoCard } from './InfoCard';
import he from 'he';

export function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { encodedToken } = useAuth();
    const {
        data: post,
        isLoading,
        error
    } = useQuery({
        queryKey: ['post', id],
        queryFn: () => fetchPost(id, encodedToken),
        select: (post) => ({
            ...post,
            title: he.unescape(post.title),
            summary: he.unescape(post.summary)
        })
    });

    const [isDeleting, setIsDeleting] = useState(false);

    const queryClient = useQueryClient();
    function handleUpdateStatus() {
        queryClient.setQueryData(['post', id], (prev) => {
            const newPost = { ...prev, is_published: !prev.is_published };
            return newPost;
        });
    }

    function handlePostUpdate(newPost) {
        queryClient.setQueryData(['post', id], () => {
            const { _id, title, summary, text, image, is_published } = newPost;
            return { _id, title, summary, text, image, is_published };
        });
    }

    if (isLoading) return <p>loading...</p>;
    if (error) return <InfoCard type="serverError"></InfoCard>;
    return (
        <>
            {isDeleting && (
                <DeletePopup
                    title="Delete post"
                    description="You are about to delete this post and it can't be recovered later. are you sure?"
                    onClickOutside={() => setIsDeleting(false)}
                    onDelete={() => submitDeletePost(id, encodedToken)}
                    onSuccess={() => navigate('/posts')}
                ></DeletePopup>
            )}
            <PostForm
                post={post}
                onSubmit={(formData, token) =>
                    submitEditPost(id, formData, token)
                }
                onSuccess={handlePostUpdate}
                onStatusUpdate={handleUpdateStatus}
                onDelete={() => setIsDeleting(true)}
            ></PostForm>
        </>
    );
}
