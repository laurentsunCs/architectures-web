import React, { useEffect, useState } from 'react';
import './HomePage.css';

function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/recipes", {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        })
        .then(response => {
            console.log("Réponse de l'API:", response); // Affiche la réponse dans tous les cas

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des recettes");
            }

            return response.json();
        })
        .then(data => {
            console.log("Données reçues de l'API:", data); // Affiche les données JSON reçues

            if (Array.isArray(data)) {
                setRecipes(data);
            } else {
                throw new Error("Format de données inattendu");
            }
            setLoading(false);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des recettes:", error); // Affiche l'erreur en cas d'échec
            setError(error.message);
            setLoading(false);
        });
    }, []);

    return (
        <div className="body-container">
            <h1>Bienvenue dans mon application React !</h1>
            <p>Découvrez une sélection de recettes gourmandes.</p>

            {loading && <p className="loading">Chargement des recettes...</p>}
            {error && <p className="error">{error}</p>}

            <div className="recipes-grid">
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <div key={recipe.id} className="recipe-card">
                            <img src={recipe.image_url || "https://via.placeholder.com/150"} alt={recipe.name} className="recipe-image" />
                            <div className="recipe-content">
                                <h3>{recipe.name}</h3>
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && <p className="no-recipes">Aucune recette disponible.</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;
