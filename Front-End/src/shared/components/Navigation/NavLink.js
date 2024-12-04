import React, {useContext} from "react";
import { NavLink } from 'react-router-dom';

import './NavLink.css';
import { AuthContext } from "../../Context/auth-context";

const NavLinks = props => {

    const auth = useContext(AuthContext);

    const logoutHandler = () => {
        auth.logout()
    }

    return(
        <ul className="nav-links">
            <li>
                <NavLink to='/' exact>All Users</NavLink>
            </li>
            {auth.isLoggedIn && (
                <li>
                    <NavLink to={`/${auth.userId}/places`} exact>My Places</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <NavLink to='/place/new' exact>Add Places</NavLink>
                </li>
            )}
            {!auth.isLoggedIn && (
                <li>
                    <NavLink to='/auth'>Authenticate</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <button onClick={logoutHandler}>LOGOUT</button>
                </li>
            )}
        </ul>
    )
};

export default NavLinks;