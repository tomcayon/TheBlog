import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Permission } from '../App';
import '../assets/style.css';

function ArticleItemList({article}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    // récupérer les 20 premiers mots de l'article
    // Récupérer les 100 premiers mots du contenu de l'article
    const content = article.contenu;
    const contentWithoutBr = content.replace(/<br\s*\/?>/gi, ' ');
    const contentWithoutHtml = contentWithoutBr.replace(/<[^>]+>/g, '');
    const contentSplit = contentWithoutHtml.split(' ');
    const content100 = contentSplit.slice(0, 20);
    const content100String = content100.join(' ');

    // Si le contenu a plus de 100 mots, ajouter "..."
    const contentfinale = article.contenu.length > 20 ? content100String + '...' : content100String;

    const cover = article.couverture ? "/api/cover/" + article.couverture : "";

    function hadleDelete() {
        setConfirmDelete(true);
    }

    function handleCancel() {
        setConfirmDelete(false);
    }

    function handleConfirm() {
        const id = article.id;
        fetch(`/api/delete-article/${id}`, {
            method: 'GET',
        })
        .then(response => response.json())
        //If response = true go to /admin
        .then(data => {
            if (data === true) {
                window.location.href = "/admin";
            }
        })

    }

    return (
        <div>
            <div className="card" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="row no-gutters w-100">
                    <div className="col-md-2" style={{ paddingRight: '10px', paddingTop: '10px', paddingBottom: '10px'}}>
                        <img
                            src={cover}
                            alt="image"
                            className="img-fluid"
                            style={{ width: '160px', height:"90px", borderRadius: '5px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="col-md-6 " style={{ marginLeft: '-5%' }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ margin: '0',}}>{article.titre}</h5>
                            {article.status === 'draft' && (
                                <span className="badge text-bg-secondary">Brouillon</span>
                            )}
                            {article.status === 'pending' && (
                                <span className="badge text-bg-warning">En attente</span>
                            )}
                            {article.status === 'published' && (
                                <span className="badge text-bg-success">Publié</span>
                            )}
                            <p className="card-text" style={{ margin: '0' }}>{contentfinale}</p>
                        </div>
                    </div>
                    <div className='col-md-4 d-flex align-items-center justify-content-end' style={{ marginLeft: '4%' }}>
                        <Link to={`/article/${article.id}`} className="btn btn-primary" style={{ marginRight: '5px' }} ><FontAwesomeIcon icon={faEye}/></Link>
                        <Link to={`/admin/edit-article/${article.id}`} className="btn btn-primary" style={{ marginRight: '5px' }} ><FontAwesomeIcon icon={faEdit}/></Link>
                        {Permission("DeletePosts") ? <button className="btn btn-danger" onClick={hadleDelete}><FontAwesomeIcon icon={faTrash}/></button> : <button className="btn btn-danger" disabled ><FontAwesomeIcon icon={faTrash}/></button> }
                    </div>
                </div>
            </div>
            {confirmDelete && (
                <div className="popup">
                    <div className="popup-content">
                    <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
                    <button className="btn btn-danger" onClick={handleConfirm}>Oui</button>
                    <button className="btn btn-primary" onClick={handleCancel}>Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ArticleItemList;
