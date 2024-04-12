import { useAuth } from '../hooks/useAuth';
import { usePagination } from '../hooks/usePagination';
import '../styles/posts.css';
import { Posts } from './Posts';
import { toast } from 'react-hot-toast';

export function PublishedPosts() {
    const { encodedToken } = useAuth();

    const {
        results,
        loading,
        error,
        fetchNextPage,
        loadingNextPage,
        hasNextPage,
        refetch
    } = usePagination('http://localhost:3000/published_posts', 4);

    function unpublishPost(button, id) {
        button.disabled = true;
        const promise = fetch(`http://localhost:3000/post/${id}/unpublish`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Authorization: `bearer ${encodedToken}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`couldn't unpublish the post`);
                }
            })
            .then(refetch())
            .catch((e) => {
                button.disabled = false;
                throw new Error(e.message);
            });

        toast.promise(promise, {
            loading: 'Unpublishing post...',
            success: `Post unpublished successfully`,
            error: (error) => `${error.message}`
        });
    }

    return (
        <Posts
            title={'Published posts'}
            posts={results}
            loading={loading}
            error={error}
            fetchNextPage={fetchNextPage}
            loadingNextPage={loadingNextPage}
            hasNextPage={hasNextPage}
            updatePostStatus={(button, id) => unpublishPost(button, id)}
        ></Posts>
    );
}
