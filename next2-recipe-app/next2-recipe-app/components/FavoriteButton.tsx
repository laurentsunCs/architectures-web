'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginRedirect } from './LoginRedirect';
import { addFavorite, removeFavorite } from '../lib/api';

interface FavoriteButtonProps {
  recipeId: string;
  isFavorite: boolean;
  onToggle: (recipeId: string) => Promise<void>;
}

export function FavoriteButton({ recipeId, isFavorite, onToggle }: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { token, username } = useAuth();

  if (!token || !username) {
    return <LoginRedirect />;
  }

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onToggle(recipeId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {isLoading ? '...' : isFavorite ? '❤️' : '♡'}
    </button>
  );
}