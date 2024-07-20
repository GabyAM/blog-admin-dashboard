import { usePostsList } from '../hooks/usePostsList';
import { Posts } from './Posts';

export function AllPosts() {
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
    } = usePostsList({ type: 'all' });

    return (
        <Posts
            title={'All posts'}
            posts={posts}
            isLoading={isLoading}
            error={error}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isFetchNextPageError={isFetchNextPageError}
            hasNextPage={hasNextPage}
            updatePostStatus={handleUpdatePostStatus}
            deletePost={handleDeletePost}
        ></Posts>
    );
}
