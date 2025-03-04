// pages/recettes/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useRecettes } from "../../context/RecettesContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://gourmet.cours.quimerch.com";

export default function RecetteDetail() {
  const router = useRouter();
  const { toggleFavorite } = useRecettes();
  const { id } = router.query;
  const { recettes } = useRecettes();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Vérifier d'abord dans les recettes du contexte
        const existing = recettes.find((r) => r.id.toString() === id);

        if (existing) {
          setRecipe(existing);
        } else {
          // Si non trouvée, fetch depuis l'API et merger avec l'état du contexte
          const { data } = await axios.get(`${API_URL}/recipes/${id}`);
          const withFavoriteStatus = {
            ...data,
            isFavorite: recettes.some((r) => r.id === data.id && r.isFavorite),
          };
          setRecipe(withFavoriteStatus);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, recettes]);

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Recette introuvable</div>;
  if (!recipe) return <div>Aucune donnée disponible</div>;

  return (
    <div className="recipe-detail">
      <div className="recipe-layout">
        {/* Colonne gauche - Image */}
        <div className="recipe-image-column">
          {recipe.image_url && (
            <>
              <img
                src={recipe.image_url || DEFAULT_IMAGE}
                alt={recipe.name}
                className="recipe-image"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(recipe.id);
                }}
                className="detail-favorite-button"
                aria-label={
                  recipe.isFavorite
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"
                }
              >
                {recipe.isFavorite ? "❤️" : "🤍"}
              </button>
            </>
          )}
        </div>
        <div className="recipe-content-column">
          <div className="recipe-header">
            <h1>{recipe.name}</h1>
          </div>

          {/* Grille des stats */}
          <div className="recipe-stats-grid">
            <div className="stat-item">
              <h3>Temps total</h3>
              <p>{recipe.prep_time + recipe.cook_time} min</p>
            </div>
            <div className="stat-item">
              <h3>Coût</h3>
              <p>{recipe.cost} €</p>
            </div>
            <div className="stat-item">
              <h3>Portions</h3>
              <p>{recipe.servings}</p>
            </div>
            <div className="stat-item">
              <h3>Calories</h3>
              <p>{recipe.calories} kcal</p>
            </div>
          </div>

          {/* Description */}
          <section className="recipe-section">
            <h2>Description</h2>
            <p>{recipe.description}</p>
          </section>

          {/* Instructions */}
          <section className="recipe-section">
            <h2>Instructions</h2>
            <div className="instructions-content">{recipe.instructions}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
