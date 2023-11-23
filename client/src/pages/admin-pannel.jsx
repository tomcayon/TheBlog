import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Pour créer des liens vers d'autres pages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Pour utiliser les icônes
import { faFileAlt, faList, faUsers, faCog, faSignOutAlt, faShield } from '@fortawesome/free-solid-svg-icons'; // Pour importer les icônes
import { Permission} from '../App';

function AdminPannelPage() {

    function logout(){
        document.cookie = `token=;max-age=0`;
        window.location.href = "/login";
    }

    return (
    <>
    <div className="container margin-card">
        <div className="row justify-content-center ">
            <div className="col-md-3">
                <Link to="/admin/new-article" className="text-decoration-none">
                    <div className="card text-center">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faFileAlt} size="2x" className='mb-2'/>
                            <h5 className="card-title">Nouvel Article</h5>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="col-md-3">
                <Link to="/admin/list-articles" className="text-decoration-none">
                    <div className="card text-center">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faList} size="2x" className='mb-2'/>
                            <h5 className="card-title">Liste des Articles</h5>
                        </div>
                    </div>
                </Link>
            </div>
            {Permission("ViewUsers") ? (
                <div className="col-md-3 mb-4">
                <Link to="/admin/list-users" className="text-decoration-none">
                    <div className="card text-center">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faUsers} size="2x" className='mb-2'/>
                            <h5 className="card-title">Liste des Utilisateurs</h5>
                        </div>
                    </div>
                </Link>
            </div>
            ) : null}
            <div className="col-md-3">
                <Link to="/admin/roles" className="text-decoration-none">
                    <div className="card text-center">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faShield} size="2x" className='mb-2'/>
                            <h5 className="card-title">Rôles</h5>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="col-md-3">
                <Link to="/admin/settings" className="text-decoration-none">
                    <div className="card text-center">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faCog} size="2x" className='mb-2'/>
                            <h5 className="card-title">Paramètres</h5>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    </div>
    <div className="d-flex justify-content-center mt-5">
        <Link to="/" className="text-decoration-none">
            <button className="btn btn-danger" onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt}/>
                <span className="ml-5">Déconnexion</span>
            </button>
        </Link>
    </div>
    </>
    );
}

export default AdminPannelPage;