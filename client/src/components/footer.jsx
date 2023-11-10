import { BlogName } from '../App';
import { useState } from 'react';


function Footer() {
    const blog = BlogName();
  return (
    <>
    <div className="footer-bot">
        <hr/>
        <footer className="text-center">
            <div className="container">
                <div className="row">
                <div className="col-md-2">
                <a className="h2 text-dark chomsky text-decoration-none mx-auto" href="/">{blog}</a>
                </div>
                </div>
            </div>
        </footer>
        <footer className="text-center">
            <div className="mx-auto">
                <ul className="list-inline">
                    <li className="list-inline-item"><a className="text-dark" href="/login">Connexion</a></li>
                    <li className="list-inline-item"><a className="text-dark" href="/mentionslegales">Mentions légales</a></li>
                    <li className="list-inline-item"><a className="text-dark" href="/conditionsutilisation">Conditions d'utilisation</a></li>
                </ul>
                <p className="user-select-none">&copy; {blog}</p>
            </div>
        </footer>
    </div>
    </>
  );
}

export default Footer;