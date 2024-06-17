import { Posts } from './Posts';
import { usePostsList } from '../hooks/usePostsList';

export function Drafts() {
    const {
        posts,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        nextPageError,
        hasNextPage,
        handleUpdatePostStatus,
        handleDeletePost
    } = usePostsList({ published: false });

    return (
        <Posts
            title={'Drafts'}
            posts={posts}
            loading={loading}
            error={error}
            fetchNextPage={fetchNextPage}
            loadingNextPage={loadingNextPage}
            hasNextPage={hasNextPage}
            updatePostStatus={(id) => handleUpdatePostStatus(id)}
            deletePost={(id) => handleDeletePost(id)}
        ></Posts>
    );
}
