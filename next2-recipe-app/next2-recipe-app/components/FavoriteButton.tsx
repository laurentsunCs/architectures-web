'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LoginRedirect } from './LoginRedirect';

interface FavoriteButtonProps {
  recipeId: string;
}

interface FavoriteResponse {
  recipe: {
    id: string;
  };
}

export function FavoriteButton({ recipeId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get<FavoriteResponse[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        const favorites = response.data;
        const isRecipeFavorite = favorites.some(
          (fav) => fav.recipe.id === recipeId
        );
        setIsFavorite(isRecipeFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [token, recipeId]);

  if (!token) {
    return <LoginRedirect />;
  }

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (!isFavorite) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
          { recipeId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        setIsFavorite(true);
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/${recipeId}`,
          { _method: 'DELETE' },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revérifier l'état des favoris en cas d'erreur
      const checkStatus = async () => {
        try {
          const response = await axios.get<FavoriteResponse[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );
          const favorites = response.data;
          const currentStatus = favorites.some((fav) => fav.recipe.id === recipeId);
          setIsFavorite(currentStatus);
        } catch (checkError) {
          console.error('Error checking status after error:', checkError);
        }
      };
      checkStatus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {isLoading ? '...' : isFavorite ? '❤️' : '♡'}
    </button>
  );
}