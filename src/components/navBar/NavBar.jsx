import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { FaSignOutAlt } from 'react-icons/fa';
import PropTypes from "prop-types";

const NavBar = ({ items, logout }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            style={{ paddingTop: '100px', backgroundColor: '#575757', borderRight: '1px solid white' }}
            className={`flex flex-col items-center bg-base-200 h-full transition-all overflow-x-hidden duration-300 ${isExpanded ? 'w-48' : 'w-16'
                }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex-grow">
                {items.map((item) => (
                    <NavLink
                        className="group flex items-center space-x-4 p-2 my-2 w-full hover:bg-base-300 rounded "
                        key={item.title}
                        to={item.route}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className={`whitespace-nowrap ${isExpanded ? 'inline' : 'hidden'}`}>{item.title}</span>
                    </NavLink>
                ))}
            </div>

            <div className="mb-4">
                <NavLink
                    className="group flex items-center space-x-4 p-2 my-2 w-full hover:bg-base-300 rounded"
                    to={'./'}
                    onClick={logout}
                >
                    <span className="text-xl"><FaSignOutAlt /></span>
                    <span className={`whitespace-nowrap ${isExpanded ? 'inline' : 'hidden'}`}>{'Logout'}</span>
                </NavLink>
            </div>

        </div>
    );
};

NavBar.propTypes = {
    items: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired
};

export default NavBar;
