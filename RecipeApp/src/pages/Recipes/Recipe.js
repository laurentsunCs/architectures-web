import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Recipe.css";
import RelatedRecipes from "./relatedRecipes/RelatedRecipes";
import LikeRecipeButton from "./LikeRecipe/LikeRecipe";

function Recipe() {
    const { id } = useParams(); // Récupérer l'ID depuis l'URL
    const [error, setError] = useState(null);
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    async function getRecipe() {
        setLoading(true);
        setError(null);

        const url = `https://gourmet.cours.quimerch.com/recipes/${id}`;
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
            setRecipe(data);
        } catch (error) {
            console.error("Erreur API :", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getRecipe();
    }, [id]);

    return (
        <div className="Recipe">
            <h1>Recette</h1>

            {loading && <p className="loading">Chargement...</p>}
            {error && <div className="error-container">{error}</div>}

            {recipe && (
                <div className="recipe-container">
                    {/* Image de la recette */}
                    <img 
                        src={recipe.image_url || "https://via.placeholder.com/700x400"} 
                        alt={recipe.name || "Recette"} 
                        className="recipe-image"
                    />

                    {/* Titre et description */}
                    <div className="recipe-content">
                        <h2>{recipe.name}</h2>
                        <p>{recipe.description}</p>
                    </div>

                    {/* Détails supplémentaires sous forme de tableau stylisé */}
                    <div className="recipe-details">
                        <div className="detail-row"><span>Catégorie :</span> {recipe.category || "N/A"}</div>
                        <div className="detail-row"><span>Calories :</span> {recipe.calories || "Non renseigné"}</div>
                        <div className="detail-row"><span>Préparation :</span> {recipe.prep_time} min</div>
                        <div className="detail-row"><span>Cuisson :</span> {recipe.cook_time} min</div>
                        <div className="detail-row"><span>Portions :</span> {recipe.servings || "N/A"}</div>
                        <div className="detail-row"><span>Coût :</span> {recipe.cost ? `${recipe.cost} €` : "Non renseigné"}</div>
                        <div className="detail-row"><span>Publié :</span> {recipe.published ? "Oui" : "Non"}</div>
                        <div className="detail-row"><span>Ajouté par :</span> {recipe.created_by || "Anonyme"}</div>
                    </div>

                    {/* Liste des ingrédients */}
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <div className="recipe-ingredients">
                            <h3>Ingrédients</h3>
                            <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index} className="ingredient-item">{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="recipe-instructions">
                        <h3>Instructions</h3>
                        {recipe.instructions 
                            ? recipe.instructions.split("\n").map((step, index) => (
                                <p key={index} className="instruction-step">➡️ {step}</p>
                            ))
                            : <p>Aucune instruction disponible</p>
                        }
                    </div>
                </div>
            )}
            

        {/* Composant LikeRecipe */}
        <LikeRecipeButton recipe_id={id} />  
        {/* Recettes similaires */} 
        <RelatedRecipes recipeid={id}/>
        </div>
    );
}

export default Recipe;
