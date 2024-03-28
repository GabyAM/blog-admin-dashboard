import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EditPost } from './components/EditPost';

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
        }
    ]);

    return <RouterProvider router={router}></RouterProvider>;
}
