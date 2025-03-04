// pages/favorites.js
import { useRecettes } from "../context/RecettesContext";
import Link from "next/link";

export default function Favorites() {
  const { recettes, toggleFavorite } = useRecettes();
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
