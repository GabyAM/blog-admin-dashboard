import { useNavigate } from 'react-router-dom';
import { submitCreatePost } from '../api/post';
import { PostForm } from './PostForm';

export function CreatePost() {
    const navigate = useNavigate();
    return (
        <PostForm
            rules={{}}
            onSubmit={submitCreatePost}
            onSuccess={() => navigate('/posts')}
        ></PostForm>
    );
}
