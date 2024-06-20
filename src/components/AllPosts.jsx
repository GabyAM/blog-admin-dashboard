import { Drafts } from './Drafts';
import { PublishedPosts } from './PublishedPosts';

export function AllPosts() {
    return (
        <>
            <Drafts></Drafts>
            <PublishedPosts></PublishedPosts>
        </>
    );
}
