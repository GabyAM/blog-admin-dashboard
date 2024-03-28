import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';

export function Router() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout></Layout>,
        }
    ]);

    return <RouterProvider router={router}></RouterProvider>;
}
