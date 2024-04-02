import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EditPost } from './components/EditPost';
import { LoginForm } from './components/LoginForm';
import { Drafts } from './components/Drafts';
import { Posts } from './components/Posts';

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
                    element: <Posts></Posts>
                },
                {
                    path: '/drafts',
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
