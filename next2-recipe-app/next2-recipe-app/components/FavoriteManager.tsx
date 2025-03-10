'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FavoriteButton } from './FavoriteButton';
import { getFavorites, addFavorite, removeFavorite } from '../lib/api';
import { Recipe } from '../types/types';

interface FavoriteManagerProps {
  recipeId: string;
  initialIsFavorite?: boolean;
}

export function FavoriteManager({ recipeId, initialIsFavorite = false }: FavoriteManagerProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { token, username } = useAuth();

  const handleToggle = async () => {
    if (!token || !username || isLoading) return;
    
    setIsLoading(true);
    try {
      if (!isFavorite) {
        await addFavorite(token, username, recipeId);
        setIsFavorite(true);
      } else {
        await removeFavorite(token, username, recipeId);
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revérifier l'état des favoris en cas d'erreur
      const favorites = await getFavorites(token);
      setIsFavorite(favorites.some(recipe => recipe.id === recipeId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FavoriteButton 
      recipeId={recipeId}
      isFavorite={isFavorite}
      onToggle={handleToggle}
    />
  );
} 