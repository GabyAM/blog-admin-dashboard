import { Posts } from './Posts';
import { usePostsList } from '../hooks/usePostsList';

export function PublishedPosts() {
    const {
        posts,
        isLoading,
        error,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        hasNextPage,
        handleUpdatePostStatus,
        handleDeletePost
    } = usePostsList({ type: 'published' });

    return (
        <Posts
            title={'Published posts'}
            posts={posts}
            isLoading={isLoading}
            error={error}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            isFetchNextPageError={isFetchNextPageError}
            updatePostStatus={handleUpdatePostStatus}
            deletePost={handleDeletePost}
        ></Posts>
    );
}
