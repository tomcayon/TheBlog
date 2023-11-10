import ArticleItemList from "../components/article-item-list";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ListArticlePage() {
    const [articles, setArticles] = useState([]);
    const [filterStatus, setFilterStatus] = useState("Tout");
    const [search, setSearch] = useState("");

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
        fetch('/api/articles')
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
    
    function handleSearch(event) {
        setSearch(event.target.value);
    }

    const filterArticles = () => {
        if (filterStatus === "Tout") {
            if(search !== "") {
                return articles.filter(article => article.titre.toLowerCase().includes(search.toLowerCase()));
            }
            return articles;
        } else {
            if(search !== "") {
                return articles.filter(article => article.titre.toLowerCase().includes(search.toLowerCase()) && article.status === filterStatus);
            }
            return articles.filter(article => article.status === filterStatus);
        }
    };

    return (
        <div>
            <h1 className="text-center mb-4">Liste des articles</h1>
            <div className="mb-4 d-flex">
                <button className={`btn btn${filterStatus === "Tout" ? '-primary' : '-secondary'} mx-2`} onClick={() => setFilterStatus("Tout")}>Tout</button>
                <button className={`btn btn${filterStatus === "draft" ? '-primary' : '-secondary'} mx-2`} onClick={() => setFilterStatus("draft")}>Brouillon</button>
                <button className={`btn btn${filterStatus === "pending" ? '-primary' : '-secondary'} mx-2`} onClick={() => setFilterStatus("pending")}>En attente</button>
                <button className={`btn btn${filterStatus === "published" ? '-primary' : '-secondary'} mx-2`} onClick={() => setFilterStatus("published")}>Publié</button>
                {/* Bar de recherche */}
                <div className="ms-auto">
                    <input type="text" className="form-control" placeholder="Rechercher" onChange={handleSearch} value={search}/>
                </div>
                <div className="ms-auto d-flex align-items-center">
                    <Link to="/admin/new-article">
                        <button className="btn btn-primary">Nouvel article</button>
                    </Link>
                </div>
            </div>
            {filterArticles().map(article => (
                <div key={article.id} className="mb-4">
                    <ArticleItemList article={article} />
                </div>
            ))}
        </div>
    );
}

export default ListArticlePage;
