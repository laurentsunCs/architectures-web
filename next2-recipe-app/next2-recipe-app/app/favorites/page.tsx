// File: app/favorites/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { FavoriteManager } from '../../components/FavoriteManager';
import { Recipe } from '../../types/types';
import { getFavorites } from '../../lib/api';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const favoritesData = await getFavorites(token);
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchFavorites();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Mes Recettes Favorites</h1>
        <div className="text-center text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Mes Recettes Favorites</h1>
        <div className="empty-state">
          <p className="text-xl text-gray-600 mb-6">Vous n'avez aucun favori</p>
          <Link href="/" className="cta-button">
            Explorer les recettes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Mes Recettes Favorites</h1>
      <div className="recipe-grid">
        {favorites.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <Link href={`/recettes/${recipe.id}`} className="block">
              <div className="recipe-image-container">
                {recipe.image_url && (
                  <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="recipe-image"
                  />
                )}
                <FavoriteManager recipeId={recipe.id} initialIsFavorite={true} />
              </div>
              <div className="recipe-content">
                <h2 className="recipe-title">{recipe.name}</h2>
                <p className="recipe-description">{recipe.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}