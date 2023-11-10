import React from 'react';
import { Link } from 'react-router-dom';

function LastArticle({ article }) {
  // Récupérer les 100 premiers mots du contenu de l'article
  const content = article.contenu;
  const contentWithoutBr = content.replace(/<br\s*\/?>/gi, ' ');
  const contentWithoutHtml = contentWithoutBr.replace(/<[^>]+>/g, '');
  const contentSplit = contentWithoutHtml.split(' ');
  const content100 = contentSplit.slice(0, 90);
  const content100String = content100.join(' ');

  // Si le contenu a plus de 100 mots, ajouter "..."
  const contentfinale = article.contenu.length > 90 ? content100String + '...' : content100String;

  // Récupérer le chemin de l'image
  const covername = article.couverture;
  const cover = "/api/cover/" + covername;

  return (
    <Link to={`/article/${article.id}`} className="text-decoration-none text-dark article-item">
    <div className="card mb-4">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={cover} alt="Image de l'article" className="img-fluid" style={{ borderTopLeftRadius: "0.325rem", borderBottomLeftRadius: "0.325rem",width:"375px", height:"245px" }} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{article.titre}</h5>
            <p className="card-text">{contentfinale}</p>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default LastArticle;
