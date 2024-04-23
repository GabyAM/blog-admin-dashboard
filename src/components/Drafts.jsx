import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { usePagination } from '../hooks/usePagination';
import { Posts } from './Posts';

export function Drafts() {
    const { encodedToken } = useAuth();
    const {
        results: posts,
        setResults: setPosts,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        hasNextPage
    } = usePagination(`http://localhost:3000/unpublished_posts`, 4);

    function handlePublishPost(id) {
        const postIndex = posts.findIndex((post) => post._id === id);
        const post = posts[postIndex];
        setPosts((prevPosts) => {
            const posts = [...prevPosts];
            posts[postIndex] = { ...posts[postIndex], isPending: true };
            return posts;
        });
        const promise = fetch(`http://localhost:3000/post/${id}/publish`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Authorization: `bearer ${encodedToken}`
            }
        })
            .then((res) => {
                if (!res.ok && res.status !== 400) {
                    throw new Error("couldn't publish the post");
                }
                return res.json();
            })
            .then((data) => {
                if (data.errors) {
                    throw new Error(
                        "The post doesn't meet the requirements to be published"
                    );
                }
                setPosts((prevPosts) => {
                    const newPosts = [...prevPosts];
                    newPosts.splice(postIndex, 1);
                    return newPosts;
                });
            })
            .catch((e) => {
                setPosts((prevPosts) => {
                    const newPosts = [...prevPosts];
                    newPosts[postIndex] = post;
                    return newPosts;
                });
                throw new Error(e.message);
            });

        toast.promise(promise, {
            loading: 'Publishing post...',
            success: `Post published successfully`,
            error: (error) => `${error.message}`
        });
    }

    function deletePost(id) {
        const postIndex = posts.findIndex((post) => post._id === id);
        setPosts((prevPosts) => {
            const newPosts = [...prevPosts];
            newPosts[postIndex] = { ...newPosts[postIndex], isPending: true };
            return newPosts;
        });
        const promise = fetch(`http://localhost:3000/post/${id}/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Authorization: `bearer ${encodedToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setPosts((prevPosts) => {
                    const newPosts = [...prevPosts];
                    newPosts.splice(postIndex, 1);
                    return newPosts;
                });
            })
            .catch((e) => {
                setPosts((prevPosts) => {
                    const newPosts = [...prevPosts];
                    newPosts[postIndex].isPending = false;
                    return newPosts;
                });
                throw new Error("Couldn't delete the post");
            });

        toast.promise(promise, {
            loading: 'Deleting post...',
            success: 'Post deleted!',
            error: (error) => `${error.message}`
        });
    }

    return (
        <Posts
            title={'Drafts'}
            posts={posts}
            loading={loading}
            error={error}
            fetchNextPage={fetchNextPage}
            loadingNextPage={loadingNextPage}
            hasNextPage={hasNextPage}
            updatePostStatus={(id) => handlePublishPost(id)}
            deletePost={(id) => deletePost(id)}
        ></Posts>
    );
}
