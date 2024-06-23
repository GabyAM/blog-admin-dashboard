import { submitCreatePost } from '../api/post';
import { PostForm } from './PostForm';

export function CreatePost() {
    return (
        <PostForm
            rules={{}}
            onSubmit={submitCreatePost}
            successUrl={'/posts'}
        ></PostForm>
    );
}
