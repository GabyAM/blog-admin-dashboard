import toast from 'react-hot-toast';
import { useAuth } from './useAuth';
import { usePagination } from './usePagination';

export function useAllPosts() {
    const { encodedToken } = useAuth();
    const {
        results: unpublishedPosts,
        setResults: setUnpublishedPosts,
        loading: loadingUnpublishedPosts,
        error: errorUnpublishedPosts,
        fetchNextPage: fetchNextPageUnpublished,
        loadingNextPage: loadingNextPageUnpublished,
        nextPageError: nextPageErrorUnpublished,
        hasNextPage: hasNextPageUnpublished,
        refetch: refetchUnpublished
    } = usePagination(`http://localhost:3000/posts?is_published=false`, 4);

    const {
        results: publishedPosts,
        setResults: setPublishedPosts,
        loading: loadingPublishedPosts,
        error: errorPublishedPosts,
        fetchNextPage: fetchNextPagePublished,
        loadingNextPage: loadingNextPagePublished,
        nextPageError: nextPageErrorPublished,
        hasNextPage: hasNextPagePublished,
        refetch: refetchPublished
    } = usePagination(`http://localhost:3000/posts?is_published=true`, 4);

    function updatePost(index, setPosts, update) {
        setPosts((prevPosts) => {
            const posts = [...prevPosts];
            posts[index] = { ...posts[index], ...update };
            return posts;
        });
    }

    function deletePost(index, setPosts) {
        setPosts((prevPosts) => {
            const newPosts = [...prevPosts];
            newPosts.splice(index, 1);
            return newPosts;
        });
    }

    function addPost(setPosts, post) {
        setPosts((prevPosts) => [post, ...prevPosts]);
    }

    function handleUpdatePostStatus(published, id) {
        const posts = published ? publishedPosts : unpublishedPosts;
        const setPosts = published ? setPublishedPosts : setUnpublishedPosts;
        const setOtherPosts = published
            ? setUnpublishedPosts
            : setPublishedPosts;
        const postIndex = posts.findIndex((post) => post._id === id);

        updatePost(postIndex, setPosts, { isPending: true });

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
                addPost(setOtherPosts, {
                    ...posts[postIndex],
                    isPending: false
                });
                deletePost(postIndex, setPosts);
            })
            .catch((e) => {
                updatePost(postIndex, setPosts, { isPending: false });
                throw new Error(e.message);
            });

        toast.promise(promise, {
            loading: published ? 'Unpublishing post...' : 'Publishing post...',
            success: `Post ${published ? 'unpublished' : 'published'} successfully`,
            error: (error) => `${error.message}`
        });
    }

    function handleDeletePost(published, id) {
        const postIndex = published
            ? publishedPosts.findIndex((post) => post._id === id)
            : unpublishedPosts.findIndex((post) => post._id === id);
        const setPosts = published ? setPublishedPosts : setUnpublishedPosts;
        updatePost(postIndex, setPosts, { isPending: true });

        const promise = fetch(`http://localhost:3000/post/${id}/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Authorization: `bearer ${encodedToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                deletePost(postIndex, setPosts);
            })
            .catch((e) => {
                updatePost(postIndex, setPosts, { isPending: false });
                throw new Error("Couldn't delete the post");
            });

        toast.promise(promise, {
            loading: 'Deleting post...',
            success: 'Post deleted!',
            error: (error) => `${error.message}`
        });
    }

    return {
        unpublishedPosts,
        loadingUnpublishedPosts,
        errorUnpublishedPosts,
        fetchNextPageUnpublished,
        loadingNextPageUnpublished,
        nextPageErrorUnpublished,
        hasNextPageUnpublished,

        publishedPosts,
        loadingPublishedPosts,
        errorPublishedPosts,
        fetchNextPagePublished,
        loadingNextPagePublished,
        nextPageErrorPublished,
        hasNextPagePublished,

        handleUpdatePostStatus,
        handleDeletePost
    };
}
