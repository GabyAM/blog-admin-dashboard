import { Outlet, useNavigate } from 'react-router-dom';
import { NavBar } from './NavBar';
import '../styles/layout.css';
import { Header } from './Header';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export function Layout() {
    const navigate = useNavigate();
    const { token, loading } = useAuth();
    useEffect(() => {
        if (!token && !loading) {
            return navigate('/login');
        }
    }, [token, loading]);
    if (token && !loading) {
        return (
            <div className="main-layout">
                <NavBar></NavBar>
                <div className="content-container flex-col">
                    <Header></Header>
                    <div className="container flex-col">
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        );
    }
}
