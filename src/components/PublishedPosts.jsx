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
    } = usePostsList({ published: true });

    return (
        <Posts
            title={'Published posts'}
            posts={posts}
            loading={isLoading}
            error={error}
            fetchNextPage={fetchNextPage}
            loadingNextPage={isFetchNextPageError}
            hasNextPage={hasNextPage}
            updatePostStatus={(id) => handleUpdatePostStatus(id)}
            deletePost={(id) => handleDeletePost(id)}
        ></Posts>
    );
}
