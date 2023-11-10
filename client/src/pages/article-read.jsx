import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ArticleReader() {
    const [article, setArticle] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch('/api/articles/' + id)
          .then(response => response.json())
          .then(data => setArticle(data))
          .catch(error => console.error(error));
    }, [id]);  // Assurez-vous de mettre id dans la liste des dépendances du useEffect

    const cover = article && article.couverture ? "/api/cover/" + article.couverture : "";

    if (article) {
        return (
            <div className="">
                <h1 className="text-center mt-4 mb-4">{article.titre}</h1>
                <div className="d-flex justify-content-center">
                    <img src={cover} alt={article.title} className="img-fluid" style={{ width: '600px' }} />
                </div>
                <div className="text-justify mx-auto mt-4" style={{ maxWidth: '600px' }}>
                    <div dangerouslySetInnerHTML={{ __html: article.contenu }} />
                </div>
            </div>
        );
    } else {
        return (
            <>
                <h1 className="text-center mt-5">Article introuvable</h1>
                <button className="btn btn-dark d-block mx-auto mt-5" onClick={() => window.history.back()}>Retour</button>
            </>
        );
    }
}

export default ArticleReader;
