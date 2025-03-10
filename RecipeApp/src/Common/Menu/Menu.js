import React, {  } from 'react';
import './Menu.css';
import Logout from '../../pages/Logout/Logout';
import { useAuth } from '../AuthProvider/AuthProvider';

function Menu(){
    const { authToken } = useAuth();
    function toggleMenu() {
        var menuLinks = document.getElementById("menu-links");
        if (menuLinks.classList.contains("active")) {
            menuLinks.classList.remove("active");
        } else {
            menuLinks.classList.add("active");
        }
    }
    return (
        <div className='Menu'>
    <nav className="menu">
        <div className="logo"><a href="/">Logo</a></div>
        <div className="menu-toggle" onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div className="menu-links" id="menu-links">
            <a href="/">Accueil</a>
            <a href="/recipe">Recipes</a>
            <a href="/favorite">Favoris</a>
            {authToken ? (
                    <a href="/login">My Account</a>
                    ) 
            : <a href="/login">Login</a>}
            {authToken ? <Logout />
            : null}
            
        </div>
    </nav>
        </div>

    )

}

export default Menu;