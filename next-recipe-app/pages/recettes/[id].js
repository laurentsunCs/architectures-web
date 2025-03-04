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
        const existing = recettes.find((r) => r.id.toString() === id);

        if (existing) {
          setRecipe(existing);
        } else {
          const { data } = await axios.get(`${API_URL}/recipes/${id}`, {
            timeout: 5000,
          });
          setRecipe(data);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Recette introuvable</div>;
  if (!recipe) return <div>Aucune donnée disponible</div>;

  return (
    <article className="recipe-detail">
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="recipe-header-image"
        />
      )}

      <div className="recipe-header">
        <h1>{recipe.name}</h1>
        <button onClick={() => toggleFavorite(recipe.id)}>
          {recipe.isFavorite
            ? "❤️ Retirer des favoris"
            : "🤍 Ajouter aux favoris"}
        </button>
      </div>

      <div className="recipe-stats">
        <div className="stat-item">
          <h3>Temps total</h3>
          <p>{recipe.prep_time + recipe.cook_time} minutes</p>
        </div>
        <div className="stat-item">
          <h3>Coût estimé</h3>
          <p>{recipe.cost} €</p>
        </div>
        <div className="stat-item">
          <h3>Portions</h3>
          <p>{recipe.servings} personnes</p>
        </div>
      </div>

      <section className="recipe-section">
        <h2>Description</h2>
        <p>{recipe.description}</p>
      </section>

      <section className="recipe-section">
        <h2>Instructions</h2>
        <div className="instructions-content">
          {recipe.instructions.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </section>

      {recipe.disclaimer && (
        <div className="disclaimer">
          <p>⚠️ {recipe.disclaimer}</p>
        </div>
      )}
    </article>
  );
}
