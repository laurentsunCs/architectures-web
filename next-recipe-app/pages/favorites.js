// pages/favorites.js
import { useRecettes } from "../context/RecettesContext";
import Link from "next/link";

export default function Favorites() {
  const { recettes, toggleFavorite } = useRecettes(); // Destructurer toggleFavorite

  const favorites = recettes.filter((recipe) => recipe?.isFavorite);

  return (
    <main className="container">
      <h1>Mes recettes favorites</h1>
      <div className="favorites-grid">
        {favorites.map((recipe) => (
          <div key={recipe.id} className="favorite-card">
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className="favorite-button"
            >
              ❌ Retirer
            </button>
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
          </div>
        ))}
      </div>

      {favorites.length === 0 && (
        <div className="empty-state">
          <p>Vous n'avez aucun favoris</p>
          <Link href="/" className="cta-button">
            Explorer les recettes
          </Link>
        </div>
      )}
    </main>
  );
}
