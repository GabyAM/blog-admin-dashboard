import { useState } from 'react';
import '../styles/usercard.css';
import {
    BanIcon,
    DemoteIcon,
    PromoteIcon,
    UnbanIcon,
    UserRemoveIcon,
    VerticalDotsIcon
} from './Icons';
import { PopupMenu } from './PopupMenu';
import { useAuth } from '../hooks/useAuth';

export function UserCard({ user, onChangeRole, onDelete }) {
    const { token: currentUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className={`user-card ${user.isPending ? 'pending' : ''}`}>
            <div className="image-container">
                <img
                    src={
                        user.image === '/images/profile.png'
                            ? '/src/assets/profile.png'
                            : `http://localhost:3000${user.image}`
                    }
                ></img>
            </div>
            <div className="info-section flex-col">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
            </div>
            <div className="options-section">
                {currentUser.id !== user._id && (
                    <>
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="icon-container more-button"
                        >
                            <VerticalDotsIcon></VerticalDotsIcon>
                        </button>
                        {isMenuOpen && (
                            <PopupMenu
                                onClickOutside={() => setIsMenuOpen(false)}
                            >
                                {!user.is_banned && (
                                    <button
                                        onClick={() => {
                                            onChangeRole(
                                                user.is_admin
                                                    ? 'demote'
                                                    : 'promote',
                                                user._id
                                            );
                                            setIsMenuOpen(false);
                                        }}
                                        className="popup-menu-option"
                                    >
                                        {user.is_admin ? (
                                            <DemoteIcon></DemoteIcon>
                                        ) : (
                                            <PromoteIcon></PromoteIcon>
                                        )}
                                        <span>
                                            {user.is_admin
                                                ? 'Demote'
                                                : 'Promote'}
                                        </span>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        onChangeRole(
                                            user.is_banned ? 'unban' : 'ban',
                                            user._id
                                        );
                                        setIsMenuOpen(false);
                                    }}
                                    className="popup-menu-option"
                                >
                                    {user.is_banned ? (
                                        <UnbanIcon></UnbanIcon>
                                    ) : (
                                        <BanIcon></BanIcon>
                                    )}
                                    <span>
                                        {user.is_banned ? 'Unban' : 'Ban'}
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(user._id);
                                        setIsMenuOpen(false);
                                    }}
                                    className="popup-menu-option"
                                >
                                    <UserRemoveIcon></UserRemoveIcon>
                                    <span>Delete</span>
                                </button>
                            </PopupMenu>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
