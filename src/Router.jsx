import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EditPost } from './components/EditPost';
import { LoginForm } from './components/LoginForm';

export function Router() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout></Layout>,
            children: [
                {
                    path: '/post/:id',
                    element: <EditPost></EditPost>
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
