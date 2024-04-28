import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { usePagination } from '../hooks/usePagination';
import { Posts } from './Posts';
import { usePosts } from '../hooks/usePosts';

export function Drafts() {
    const {
        unpublishedPosts,
        loadingUnpublishedPosts,
        errorUnpublishedPosts,
        fetchNextPageUnpublished,
        loadingNextPageUnpublished,
        nextPageErrorUnpublished,
        hasNextPageUnpublished,
        handleUpdatePostStatus,
        handleDeletePost
    } = usePosts();

    return (
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
    );
}
