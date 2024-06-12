import { useState, useEffect, useRef } from 'react'
import { useAuth, useUser } from '../../context'
import styles from './Header.module.css'
import { NavLink } from 'react-router-dom'
import Notifications from '../notifications/Notifications'

const Header = () => {
    const { container, dropdownContainer, username, dropdownMenu, usernamePicture, usernameContainer, logo } = styles
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
        <div className={`${container}`} >
            <div className={logo}>
                <img src='../../../assets/nessie.png' />
                <div>FitNessie</div>
            </div>

            {user ? (

                <div className={dropdownContainer} ref={dropdownRef}>
                    <Notifications />
                    <div className={usernameContainer} onClick={toggleDropdown}>

                        <img src={userData?.profilePicUrl} className={usernamePicture} />
                        <div className={username}>{userData && userData.username}</div>
                    </div>

                    {showDropdown && (
                        <div className={dropdownMenu}>
                            <NavLink to="/user-profile">Profile</NavLink>
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