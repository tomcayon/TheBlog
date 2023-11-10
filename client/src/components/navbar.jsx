import { useState, useEffect } from 'react';
import { BlogName } from '../App';

function Navbar() {

    return (
        <>
<div className='header-navbar'>
  <nav className="navbar navbar-light text-center">
    <a className="TheBlog text-dark chomsky text-decoration-none mx-auto" href="/">{BlogName()}</a>
  </nav>
  <nav className="navbar navbar-light text-center double-divider">
    <a className="nav-link mx-2" href="/">Accueil</a>
    <a className="nav-link mx-2" href="/category/nourriture">Nourriture</a>
    <a className="nav-link mx-2" href="/category/nourriture BIS">Nourriture BIS</a>
  </nav>
</div>


        </>
    );
}

export default Navbar;