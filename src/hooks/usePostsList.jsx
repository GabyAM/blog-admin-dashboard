import toast from 'react-hot-toast';
import { useAuth } from './useAuth';
import { usePagination } from './usePagination';

export function usePostsList({ published = true }) {
    const { encodedToken } = useAuth();
    const {
        results: posts,
        setResults: setPosts,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        nextPageError,
        hasNextPage,
        refetch
    } = usePagination(
        `http://localhost:3000/posts?is_published=${published}`,
        4
    );

    function updatePost(index, update) {
        setPosts((prevPosts) => {
            const posts = [...prevPosts];
            posts[index] = { ...posts[index], ...update };
            return posts;
        });
    }

    function deletePost(index) {
        setPosts((prevPosts) => {
            const newPosts = [...prevPosts];
            newPosts.splice(index, 1);
            return newPosts;
        });
    }

    function handleUpdatePostStatus(id) {
        const postIndex = posts.findIndex((post) => post._id === id);
        updatePost(postIndex, { isPending: true });

        const promise = fetch(
            `http://localhost:3000/post/${id}/${published ? 'unpublish' : 'publish'}`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Authorization: `bearer ${encodedToken}`
                }
            }
        )
            .then((res) => {
                if (!res.ok && res.status !== 400) {
                    throw new Error(
                        `couldn't ${published ? 'unpublish' : 'publish'} the post`
                    );
                }
                return res.json();
            })
            .then((data) => {
                if (data.errors) {
                    throw new Error(
                        "The post doesn't meet the requirements to be published"
                    );
                }
                deletePost(postIndex);
            })
            .catch((e) => {
                updatePost(postIndex, { isPending: false });
                throw new Error(e.message);
            });

        toast.promise(promise, {
            loading: published ? 'Unpublishing post...' : 'Publishing post...',
            success: `Post ${published ? 'unpublished' : 'published'} successfully`,
            error: (error) => `${error.message}`
        });
    }

    function handleDeletePost(id) {
        const postIndex = posts.findIndex((post) => post._id === id);
        updatePost(postIndex, { isPending: true });
        const promise = fetch(`http://localhost:3000/post/${id}/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Authorization: `bearer ${encodedToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                deletePost(postIndex);
            })
            .catch((e) => {
                updatePost(postIndex, { isPending: false });
                throw new Error("Couldn't delete the post");
            });

        toast.promise(promise, {
            loading: 'Deleting post...',
            success: 'Post deleted!',
            error: (error) => `${error.message}`
        });
    }

    return {
        posts,
        setPosts,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        nextPageError,
        hasNextPage,
        refetch,
        handleUpdatePostStatus,
        handleDeletePost
    };
}
