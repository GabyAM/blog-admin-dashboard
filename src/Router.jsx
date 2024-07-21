import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EditPost } from './components/EditPost';
import { LoginForm } from './components/LoginForm';
import { Drafts } from './components/Drafts';
import { PublishedPosts } from './components/PublishedPosts';
import { Comments } from './components/Comments';
import { RegularUsers } from './components/RegularUsers';
import { Admins } from './components/Admins';
import { BannedUsers } from './components/BannedUsers';
import { CreatePost } from './components/CreatePost';
import { AllUsers } from './components/AllUsers';
import { Overview } from './components/Overview';
import { ErrorCatcher } from './components/ErrorCatcher';

export function Router() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout></Layout>,
            errorElement: <ErrorCatcher></ErrorCatcher>,
            children: [
                {
                    index: true,
                    element: <Overview></Overview>
                },
                { path: '/post/create', element: <CreatePost></CreatePost> },
                {
                    path: '/post/:id',
                    element: <EditPost></EditPost>
                },
                {
                    path: '/posts',
                    element: (
                        <>
                            <Drafts></Drafts>
                            <PublishedPosts></PublishedPosts>
                        </>
                    )
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
                    element: (
                        <>
                            <RegularUsers></RegularUsers>
                            <Admins></Admins>
                            <BannedUsers></BannedUsers>
                        </>
                    )
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
