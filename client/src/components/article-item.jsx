import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/style.css'


function ArticleItem({ article }) {
    const content = article.contenu;
  const contentWithoutBr = content.replace(/<br\s*\/?>/gi, ' ');
  const contentWithoutHtml = contentWithoutBr.replace(/<[^>]+>/g, '');
  const contentSplit = contentWithoutHtml.split(' ');
  const content100 = contentSplit.slice(0, 50);
  const content100String = content100.join(' ');

  // Si le contenu a plus de 100 mots, ajouter "..."
  const contentfinale = article.contenu.length > 50 ? content100String + '...' : content100String;

  // Récupérer le chemin de l'image
  const covername = article.couverture;
  const cover = "/api/cover/" + covername;

    return (
        <Link to={`/article/${article.id}`} className="text-decoration-none text-dark article-item">
        <div className="mb-4 card" style={{marginRight:"1%", marginLeft:"1%"}}>
            <img src={cover} alt="Image de l'article" className="card-img-top" style={{width:"100%", height:"230px"}} />
            <div className="card-body">
                <h5 className="card-title">{article.titre}</h5>
                <p className="card-text">{contentfinale}</p>
            </div>
        </div>
        </Link>
    );
}

export default ArticleItem;
