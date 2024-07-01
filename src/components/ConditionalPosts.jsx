import { useEffect, useState } from 'react';
import { usePostsList } from '../hooks/usePostsList';
import { Posts } from './Posts';

export function ConditionalPosts() {
    const {
        handleUpdatePostStatus: handleUpdateDraftStatus,
        handleDeletePost: handleDeleteDraft,
        ...draftProps
    } = usePostsList({ published: false });

    const [shouldFetchPublished, setShouldFetchPublished] = useState(false);
    const { handleUpdatePostStatus, handleDeletePost, ...postProps } =
        usePostsList({
            published: true,
            enabled: shouldFetchPublished
        });

    useEffect(() => {
        if (!draftProps.isLoading && !draftProps.error) {
            const draftsCount =
                draftProps.posts?.pages?.[0]?.results?.length || 0;
            setShouldFetchPublished((prev) => {
                const newValue = draftsCount === 0;
                if (newValue !== prev) {
                    return newValue;
                }
                return prev;
            });
        }
    }, [draftProps.posts, draftProps.isLoading, draftProps.error]);

    if (shouldFetchPublished) {
        return (
            <Posts
                title={'Published posts'}
                updatePostStatus={handleUpdatePostStatus}
                deletePost={handleDeletePost}
                {...postProps}
            ></Posts>
        );
    } else
        return (
            <Posts
                title={'Drafts'}
                updatePostStatus={handleUpdateDraftStatus}
                deletePost={handleDeleteDraft}
                {...draftProps}
            ></Posts>
        );
}
