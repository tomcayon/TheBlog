import { useEffect, useState } from "react";
import ArticleItem from "../components/article-item";
import LastArticle from "../components/last-article";

function HomePage() {

  const [articles, setArticles] = useState([]);

  function convertDate(dateString) {
    const dateParts = dateString.split('-');
    if (dateParts.length === 6) {
        const day = dateParts[0];
        const month = dateParts[1];
        const year = dateParts[2];
        const hours = dateParts[3];
        const minutes = dateParts[4];
        const seconds = dateParts[5];
        
        // Les mois dans JavaScript sont basés sur un index 0, donc soustrayez 1 au mois
        return new Date(year, month - 1, day, hours, minutes, seconds);
    } else {
        // Gérer le format incorrect ou vide
        return new Date(0); // Date par défaut
    }
}


useEffect(() => {
    fetch('/api/articles/published')
        .then(response => response.json())
        .then(data => {
            // Convertir la date pour chaque article
            data.forEach(article => {
                article.date = convertDate(article.date);
            });

            // Trier les articles du plus récent au plus ancien
            data.sort((a, b) => b.date - a.date);
            
            setArticles(data);
        })
        .catch(error => console.error(error));
}, []);

  // Trier les articles par date et mettre le dernier article dans une variable
  const lastArticle = articles.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const otherArticles = articles
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(1, 4);

  return (
    <>
      <div className="mt-4">
        {lastArticle && <LastArticle article={lastArticle} />}
      </div>
      <div className="row d-flex">
        {otherArticles.map(article => (
          <div key={article.id} className="col-md-4">
            <ArticleItem article={article} />
          </div>
        ))}
        {articles.length === 0 && <p className="text-center">Aucun article publié</p>}
      </div>
    </>
  );
}


export default HomePage;