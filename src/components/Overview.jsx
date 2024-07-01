import { useEffect, useState } from 'react';
import { usePostsList } from '../hooks/usePostsList';
import { Posts } from './Posts';
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
