import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Favorite.css";

function Favorite() {  

        const [error, setError] = useState(null);
        const [recipes, setRecipes] = useState([]);
        const [loading, setLoading] = useState(true);

        async function getFavorite() {
            setLoading(true);
            setError(null);

            const url = `https://gourmet.cours.quimerch.com/favorites`;
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur de récupération : ${response.status}`);
                }

                const data = await response.json();
                console.log("Données reçues :", data);
                setRecipes(data);

                console.log("Received response json", data);
                if (Array.isArray(data)) {
                    setRecipes(data);
                } else {
                    throw new Error("Format de données inattendu");
                }
                setLoading(false);
            } catch (error) {
                console.error("Erreur API :", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

            useEffect(() => {
                getFavorite();
            });
    return (
        <div className="Favorite">
           < h1>Favoris</h1>
        <div className="recipes-grid">
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <div key={recipe.id} className="recipe-card">
                                {/* Vérification avant d'afficher l'image */}
                                <a href={`/recipe/${recipe.id}`}>
                                    <img 
                                        src={recipe?.image_url || "https://via.placeholder.com/150"} 
                                        alt={recipe?.name || "Recette"} 
                                        className="recipe-image" 
                                    />
                                    <div className="recipe-content">
                                        <h3>{recipe?.name || "Recette"}</h3>
                                    </div>
                                </a>
                            </div>
                        ))
                    ) : (
                        !loading && <p className="no-recipes">Aucune recette disponible.</p>
                    )}
                </div>
        </div>
    );
    }   
export default Favorite;