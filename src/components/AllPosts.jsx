import { Posts } from './Posts';
import { useAllPosts } from '../hooks/useAllPosts';

export function AllPosts() {
    const {
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
    } = useAllPosts();

    return (
        <>
            {unpublishedPosts.length > 0 && (
                <Posts
                    title={'Drafts'}
                    posts={unpublishedPosts}
                    loading={loadingUnpublishedPosts}
                    error={errorUnpublishedPosts}
                    fetchNextPage={fetchNextPageUnpublished}
                    loadingNextPage={loadingNextPageUnpublished}
                    hasNextPage={hasNextPageUnpublished}
                    updatePostStatus={(id) => handleUpdatePostStatus(false, id)}
                    deletePost={(id) => handleDeletePost(false, id)}
                ></Posts>
            )}
            {publishedPosts.length > 0 && (
                <Posts
                    title={'Published posts'}
                    posts={publishedPosts}
                    loading={loadingPublishedPosts}
                    error={errorPublishedPosts}
                    fetchNextPage={fetchNextPagePublished}
                    loadingNextPage={loadingNextPagePublished}
                    hasNextPage={hasNextPagePublished}
                    updatePostStatus={(id) => handleUpdatePostStatus(true, id)}
                    deletePost={(id) => handleDeletePost(true, id)}
                ></Posts>
            )}
        </>
    );
}
