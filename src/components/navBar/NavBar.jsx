import styles from './NavBar.module.css';
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const NavBar = ({ items, navItemClassName = '', logout }) => {
    const { container, item: navItem } = styles;

    return (
        <div className={container}>
            {items.map((item) => (
                <NavLink className={`${navItem}`} key={item.title} to={item.route} onClick={item.title === 'Logout' ? logout : null}>
                    {item.title}
                </NavLink>
            ))}
        </div>
    )
}

NavBar.propTypes = {
    items: PropTypes.array,
    navItemClassName: PropTypes.string
};

export default NavBar