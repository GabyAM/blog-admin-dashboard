import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { usePagination } from '../hooks/usePagination';
import { Posts } from './Posts';
import { usePosts } from '../hooks/usePosts';

export function PublishedPosts() {
    const {
        publishedPosts,
        loadingPublishedPosts,
        errorPublishedPosts,
        fetchNextPagePublished,
        loadingNextPagePublished,
        nextPageErrorPublished,
        hasNextPagePublished,

        handleUpdatePostStatus,
        handleDeletePost
    } = usePosts();

    return (
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
    );
}
