import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { PopupMenu } from './PopupMenu';
import { LogoutIcon, ProfileIcon } from './Icons';
import { SearchBar } from './SearchBar';
import { IMAGES_URL } from '../constants';
import avatarPlaceholder from '../assets/profile.png';

export function Header() {
    const navigate = useNavigate();
    const { token: currentUser, removeToken } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header>
            <button
                className="new-post-button"
                onClick={() => navigate('/post/create')}
            >
                New post
            </button>
            <div className="main-search-bar-section">
                <SearchBar></SearchBar>
            </div>
            <div>
                <button
                    className="header-user-card"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <div className="image-container">
                        <img
                            src={
                                currentUser.image === '/images/profile.png'
                                    ? avatarPlaceholder
                                    : IMAGES_URL + currentUser.image
                            }
                        ></img>
                    </div>
                    <div className="user-info">
                        <span>{currentUser.name}</span>
                        <span>{currentUser.email}</span>
                    </div>
                </button>
                {isMenuOpen && (
                    <PopupMenu onClickOutside={() => setIsMenuOpen(false)}>
                        <Link className="popup-menu-option">
                            <ProfileIcon></ProfileIcon>
                            <span>Profile</span>
                        </Link>
                        <button
                            onClick={removeToken}
                            className="popup-menu-option"
                        >
                            <LogoutIcon></LogoutIcon>
                            <span>Log out</span>
                        </button>
                    </PopupMenu>
                )}
            </div>
        </header>
    );
}
