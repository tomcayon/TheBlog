import React from 'react';
import ArticleItem from '../components/article-item';
import { useParams } from 'react-router-dom'; // Pour obtenir la valeur de `category` depuis les paramètres de l'URL

function CategoryPage() {
    // Utilisez useParams() pour obtenir la valeur de `category` depuis les paramètres de l'URL    //Take /:category from url
    const { category } = useParams();
    //Mettre une majuscule à la première lettre
    const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);



    // Votre contenu d'article
    const article = {
        title: "Article 1",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        image: "https://chefrecettes.s3.eu-west-3.amazonaws.com/recettes/IspOf0cR7bdDGKxIsIDi1vidn3dcMktp0yV9sG5A.jpeg"
    };

    return (
        <>
            <div>
                <h1>Category: {categoryCapitalized}</h1>
            </div>
            <div className='d-flex mt-4'>
            <ArticleItem article={article} />
            <ArticleItem article={article} />
            <ArticleItem article={article} />
            </div>
            <div className='d-flex mt-4'>
            <ArticleItem article={article} />
            <ArticleItem article={article} />
            <ArticleItem article={article} />
            </div>
            <div className='d-flex mt-4'>
            <ArticleItem article={article} />
            <ArticleItem article={article} />
            <ArticleItem article={article} />
            </div>
        </>
    );
}

export default CategoryPage;
