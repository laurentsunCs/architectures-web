// pages/favorites.js
import { useRecettes } from "../context/RecettesContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios"; // Ajout de l'importation axios
import Link from "next/link";

const API_URL = "https://gourmet.cours.quimerch.com"; // Ajout de l'API_URL

export default function Favorites() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth(); // Ajout de user
  const { recettes, setRecettes, toggleFavorite } = useRecettes(); // Ajout de setRecettes

  // Redirection si non authentifié
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!loading && !isAuthenticated) {
      }
      try {
        const { data } = await axios.get(`${API_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: "application/json, application/xml",
          },
        });

        // Mise à jour des recettes avec l'état favori
        setRecettes((prev) =>
          prev.map((recipe) => ({
            ...recipe,
            isFavorite: data.some((fav) => fav.recipe_id === recipe.id),
          }))
        );
      } catch (error) {
        console.error("Erreur de chargement des favoris:", error);
      }
    };

    if (isAuthenticated && user) {
      fetchFavorites();
    }
  }, [isAuthenticated, user, setRecettes]); // Ajout de setRecettes dans les dépendances

  // Gestion du loading
  if (loading || !isAuthenticated) {
    return <div className="loading">Chargement...</div>;
  }
  const favorites = recettes.filter((recipe) => recipe?.isFavorite);

  return (
    <main className="container">
      <h1>Mes recettes favorites</h1>
      <div className="favorites-grid">
        {favorites.map((recipe) => (
          <Link
            href={`/recettes/${recipe.id}`}
            key={recipe.id}
            className="card-link"
          >
            <div
              className="favorite-card"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3)), url(${recipe.image_url})`,
              }}
            >
              <div className="favorite-card-content">
                <button
                  className="favorite-heart"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                >
                  ❤️
                </button>
                <h3>{recipe.name}</h3>
                <p>{recipe.description}</p>
              </div>
            </div>
          </Link>
        ))}

        {favorites.length === 0 && (
          <div className="empty-state">
            <p>Vous n'avez aucun favoris</p>
            <Link href="/" className="cta-button">
              Explorer les recettes
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
