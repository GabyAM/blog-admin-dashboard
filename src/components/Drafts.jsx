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
    } = usePostsList({ published: false });

    return (
        <Posts
            title={'Drafts'}
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
