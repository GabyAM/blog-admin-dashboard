import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home } from './components/Home';

export function Router() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home></Home>
        }
    ]);

    return <RouterProvider router={router}></RouterProvider>;
}
