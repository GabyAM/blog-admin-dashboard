import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EditPost } from './components/EditPost';
import { LoginForm } from './components/LoginForm';
import { Drafts } from './components/Drafts';
import { PublishedPosts } from './components/PublishedPosts';
import { AllPosts } from './components/AllPosts';

export function Router() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout></Layout>,
            children: [
                {
                    path: '/post/:id',
                    element: <EditPost></EditPost>
                },
                {
                    path: '/posts',
                    element: <AllPosts></AllPosts>
                },
                {
                    path: '/posts/published',
                    element: <PublishedPosts></PublishedPosts>
                },
                {
                    path: '/posts/drafts',
                    element: <Drafts></Drafts>
                }
            ]
        },
        {
            path: '/login',
            element: <LoginForm></LoginForm>
        }
    ]);

    return <RouterProvider router={router}></RouterProvider>;
}
