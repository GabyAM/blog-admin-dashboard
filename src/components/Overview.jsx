import { ConditionalPosts } from './ConditionalPosts';
import { ConditionalUsers } from './ConditionalUsers';

export function Overview() {
    return (
        <>
            <ConditionalPosts></ConditionalPosts>
            <ConditionalUsers></ConditionalUsers>
        </>
    );
}
