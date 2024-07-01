import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EditPost } from './components/EditPost';
import { LoginForm } from './components/LoginForm';
import { Drafts } from './components/Drafts';
import { PublishedPosts } from './components/PublishedPosts';
import { AllPosts } from './components/AllPosts';
import { Comments } from './components/Comments';
import { RegularUsers } from './components/RegularUsers';
import { Admins } from './components/Admins';
import { BannedUsers } from './components/BannedUsers';
import { AllUsers } from './components/AllUsers';
import { Overview } from './components/Overview';

export function Router() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout></Layout>,
            children: [
                {
                    index: true,
                    element: <Overview></Overview>
                },
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
                },
                {
                    path: '/comments',
                    element: <Comments></Comments>
                },
                {
                    path: '/users',
                    element: <AllUsers></AllUsers>
                },
                {
                    path: '/users/regular',
                    element: <RegularUsers></RegularUsers>
                },
                {
                    path: '/users/admin',
                    element: <Admins></Admins>
                },
                {
                    path: '/users/banned',
                    element: <BannedUsers></BannedUsers>
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
