import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import '../styles/layout.css';
import { Header } from './Header';

export function Layout() {
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
