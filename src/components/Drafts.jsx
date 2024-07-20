import { Posts } from './Posts';
import { usePostsList } from '../hooks/usePostsList';

export function Drafts() {
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
    } = usePostsList({ type: 'unpublished' });

    return (
        <Posts
            title={'Drafts'}
            posts={posts}
            isLoading={isLoading}
            error={error}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            updatePostStatus={(id) => handleUpdatePostStatus(id)}
            deletePost={(id) => handleDeletePost(id)}
        ></Posts>
    );
}
