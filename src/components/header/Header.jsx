import { useState, useEffect, useRef } from 'react'
import { useAuth, useUser } from '../../context'
import styles from './Header.module.css'
import { NavLink } from 'react-router-dom'
import {FaBell} from 'react-icons/fa'
import Notifications from '../notifications/Notifications'

const Header = () => {
    const { container, dropdownContainer, username, dropdownMenu, usernamePicture, usernameContainer } = styles
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const { userData, loading } = useUser();

    const handleLogout = () => {
        logout();
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (user) {
            setShowDropdown(false);
        }
    }, [user]);

    return (
        <div className={`${container} bg-base-200`} >
            <div>Logo</div>

            {user ? (

                <div className={dropdownContainer} ref={dropdownRef}>
                    <Notifications/> 
                    <div className={usernameContainer} onClick={toggleDropdown}>

                        <img src={userData?.profilePicUrl} className={usernamePicture} />
                        <div className={username}>{userData && userData.username}</div>
                    </div>

                    {showDropdown && (
                        <div className={dropdownMenu}>
                            <NavLink to="/user-profile">Profile</NavLink>
                            {userData && userData.role === 'admin' && <NavLink to="/admin">Admin Panel</NavLink>}
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className={dropdownContainer}>
                    <div className="nav-bar-item">

                        <NavLink to="/auth">Login</NavLink>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header