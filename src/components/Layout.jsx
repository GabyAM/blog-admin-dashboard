import { Outlet, useNavigate } from 'react-router-dom';
import { NavBar } from './NavBar';
import '../styles/layout.css';
import { Header } from './Header';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { SearchResults } from './SearchResults';
import { useSearch } from '../hooks/useSearch';

export function Layout() {
    const navigate = useNavigate();
    const { token, loading } = useAuth();
    useEffect(() => {
        if (!token && !loading) {
            return navigate('/login');
        }
    }, [token, loading, navigate]);
    const { search } = useSearch();
    if (token && !loading) {
        return (
            <div className="main-layout">
                <NavBar></NavBar>
                <div className="content-container flex-col">
                    <Header></Header>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                border: '1px solid var(--grey-100)',
                                boxShadow: '2px 2px 6px rgba(0,0,0,0.2)'
                            }
                        }}
                    ></Toaster>
                    <div className="container flex-col">
                        {search ? (
                            <SearchResults></SearchResults>
                        ) : (
                            <Outlet></Outlet>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
