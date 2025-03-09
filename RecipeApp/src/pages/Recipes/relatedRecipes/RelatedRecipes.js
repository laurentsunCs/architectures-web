import React, {useEffect, useState} from "react";  
import "./RelatedRecipe.css";

function RelatedRecipes(props) {
    const [error, setError] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const defaultImage = "https://images.pexels.com/photos/2611817/pexels-photo-2611817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

    async function getRelatedRecipes() {
        const url = `https://gourmet.cours.quimerch.com/recipes/${props.recipeid}/related`;
        console.log("URL de la recette associée :", url);
        setLoading(true);
        setError(null);
        console.log("Chargement des recettes similaires...");


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
            console.log("Received response json", data);
            if (Array.isArray(data)) {
                setRecipes(data);
            } else {
                throw new Error("Format de données inattendu");
            }  
            setLoading(false);
        }
        catch (error) {
            console.error("Erreur API :", error.message);
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };
        useEffect(() => { 
            getRelatedRecipes();
        }, [props.recipeid]);


        

    return (
        <div className="RelatedRecipes">
            <h1 className="related-recipe-title">Recettes similaires</h1>
                     <div className="recipes-grid">
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <div key={recipe.id} className="recipe-card">
                                {/* Vérification avant d'afficher l'image */}
                                <a href={`/recipe/${recipe.id}`}>
                                    <img 
                                        src={recipe?.image_url || defaultImage} 
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

};

export default RelatedRecipes;