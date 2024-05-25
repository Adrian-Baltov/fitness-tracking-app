import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";


const NavBar = ({ items, logout }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const filteredItems = items.filter(item => item.title !== 'Logout');
    const logoutItem = items.find(item => item.title === 'Logout');

    return (
        <div
            className={`flex flex-col items-center bg-base-200 h-full transition-all duration-300 ${isExpanded ? 'w-48' : 'w-16'
                }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex-grow">
                {filteredItems.map((item) => (
                    <NavLink
                        className="group flex items-center space-x-4 p-2 my-2 w-full hover:bg-base-300 rounded"
                        key={item.title}
                        to={item.route}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className={`whitespace-nowrap ${isExpanded ? 'inline' : 'hidden'}`}>{item.title}</span>
                    </NavLink>
                ))}
            </div>
            {logoutItem && (
                <div className="mb-4">
                    <NavLink
                        className="group flex items-center space-x-4 p-2 my-2 w-full hover:bg-base-300 rounded"
                        key={logoutItem.title}
                        to={logoutItem.route}
                        onClick={logout}
                    >
                        <span className="text-xl">{logoutItem.icon}</span>
                        <span className={`whitespace-nowrap ${isExpanded ? 'inline' : 'hidden'}`}>{logoutItem.title}</span>
                    </NavLink>
                </div>
            )}
        </div>
    );
};

NavBar.propTypes = {
    items: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired
};

export default NavBar;
