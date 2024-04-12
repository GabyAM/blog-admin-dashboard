import { usePagination } from '../hooks/usePagination';
import { toast } from 'react-hot-toast';
import { Posts } from './Posts';
import { useAuth } from '../hooks/useAuth';

export function AllPosts() {
    const { encodedToken } = useAuth();

    const {
        results: unpublishedPosts,
        loading: loadingUnpublishedPosts,
        error: errorUnpublishedPosts,
        fetchNextPage: fetchNextPageUnpublished,
        loadingNextPage: loadingNextPageUnpublished,
        hasNextPage: hasNextPageUnpublished,
        refetch: refetchUnpublishedPosts
    } = usePagination('http://localhost:3000/unpublished_posts', 4);

    const {
        results: publishedPosts,
        loading: loadingPublishedPosts,
        error: errorPublishedPosts,
        fetchNextPage: fetchNextPagePublished,
        loadingNextPage: loadingNextPagePublished,
        hasNextPage: hasNextPagePublished,
        refetch: refetchPublishedPosts
    } = usePagination('http://localhost:3000/published_posts', 4);

    function updatePostStatus(published, button, id) {
        button.disabled = true;
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
                refetchPublishedPosts();
                refetchUnpublishedPosts();
            })
            .catch((e) => {
                button.disabled = false;
                throw new Error(e.message);
            });

        toast.promise(promise, {
            loading: published ? 'Unpublishing post...' : 'Publishing post...',
            success: `Post ${published ? 'unpublished' : 'published'} successfully`,
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
                updatePostStatus={(button, id) =>
                    updatePostStatus(false, button, id)
                }
            ></Posts>
            <Posts
                title={'Published posts'}
                posts={publishedPosts}
                loading={loadingPublishedPosts}
                error={errorPublishedPosts}
                fetchNextPage={fetchNextPagePublished}
                loadingNextPage={loadingNextPagePublished}
                hasNextPage={hasNextPagePublished}
                updatePostStatus={(button, id) =>
                    updatePostStatus(true, button, id)
                }
            ></Posts>
        </>
    );
}
