import { usePagination } from '../hooks/usePagination';
import { toast } from 'react-hot-toast';
import { Posts } from './Posts';
import { useAuth } from '../hooks/useAuth';

export function AllPosts() {
    const { encodedToken } = useAuth();

    const {
        results: unpublishedPosts,
        setResults: setUnpublishedPosts,
        loading: loadingUnpublishedPosts,
        error: errorUnpublishedPosts,
        fetchNextPage: fetchNextPageUnpublished,
        loadingNextPage: loadingNextPageUnpublished,
        hasNextPage: hasNextPageUnpublished
    } = usePagination('http://localhost:3000/unpublished_posts', 4);

    const {
        results: publishedPosts,
        setResults: setPublishedPosts,
        loading: loadingPublishedPosts,
        error: errorPublishedPosts,
        fetchNextPage: fetchNextPagePublished,
        loadingNextPage: loadingNextPagePublished,
        hasNextPage: hasNextPagePublished
    } = usePagination('http://localhost:3000/published_posts', 4);

    function updatePostStatus(published, id) {
        const posts = published ? publishedPosts : unpublishedPosts;

        const setPosts = published ? setPublishedPosts : setUnpublishedPosts;
        const setOtherPosts = published
            ? setUnpublishedPosts
            : setPublishedPosts;

        const postIndex = posts.findIndex((post) => post._id === id);
        const post = posts[postIndex];
        setPosts((prevPosts) => {
            const posts = [...prevPosts];
            posts[postIndex] = { ...posts[postIndex], isPending: true };
            return posts;
        });
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
                setPosts((prevPosts) => {
                    const newPosts = [...prevPosts];
                    newPosts.splice(postIndex, 1);
                    return newPosts;
                });

                setOtherPosts((prevPosts) => {
                    const newPosts = [...prevPosts];
                    newPosts[postIndex] = { ...post, is_published: !published };
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
            loading: published ? 'Unpublishing post...' : 'Publishing post...',
            success: `Post ${published ? 'unpublished' : 'published'} successfully`,
            error: (error) => `${error.message}`
        });
    }

    function deletePost(published, id) {
        const postIndex = published
            ? publishedPosts.findIndex((post) => post._id === id)
            : unpublishedPosts.findIndex((post) => post._id === id);
        const setPosts = published ? setPublishedPosts : setUnpublishedPosts;
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
        <>
            <Posts
                title={'Drafts'}
                posts={unpublishedPosts}
                loading={loadingUnpublishedPosts}
                error={errorUnpublishedPosts}
                fetchNextPage={fetchNextPageUnpublished}
                loadingNextPage={loadingNextPageUnpublished}
                hasNextPage={hasNextPageUnpublished}
                updatePostStatus={(id) => updatePostStatus(false, id)}
                deletePost={(id) => deletePost(false, id)}
            ></Posts>
            <Posts
                title={'Published posts'}
                posts={publishedPosts}
                loading={loadingPublishedPosts}
                error={errorPublishedPosts}
                fetchNextPage={fetchNextPagePublished}
                loadingNextPage={loadingNextPagePublished}
                hasNextPage={hasNextPagePublished}
                updatePostStatus={(id) => updatePostStatus(true, id)}
                deletePost={(id) => deletePost(true, id)}
            ></Posts>
        </>
    );
}
