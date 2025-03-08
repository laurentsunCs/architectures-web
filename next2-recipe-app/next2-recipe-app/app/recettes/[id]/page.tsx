'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { FavoriteButton } from '../../../components/FavoriteButton';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Recipe {
  id: string;
  name: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  cost: number;
  instructions: string;
}

export default function RecipeDetails() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`);
        const recipeData = response.data as Recipe;
        
        if (!recipeData) {
          setError(true);
          return;
        }

        setRecipe(recipeData);
        setError(false);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement en cours...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="empty-state">
          <p className="text-xl text-gray-600 mb-6">Recette introuvable</p>
          <Link href="/" className="cta-button">
            Retour aux recettes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="recipe-detail-container">
        {/* Image en haut */}
        <div className="recipe-detail-image">
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.name}
            />
          )}
          {token && (
            <div className="absolute top-4 right-4">
              <FavoriteButton recipeId={recipe.id} />
            </div>
          )}
        </div>

        {/* Contenu en dessous */}
        <div className="recipe-detail-content">
          <h1 className="recipe-detail-title">{recipe.name}</h1>
          
          {/* Grille des statistiques */}
          <div className="recipe-stats-grid">
            <div className="recipe-stat-item">
              <div className="recipe-stat-label">Temps total</div>
              <div className="recipe-stat-value">{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</div>
            </div>
            <div className="recipe-stat-item">
              <div className="recipe-stat-label">Coût</div>
              <div className="recipe-stat-value">{recipe.cost || 0} €</div>
            </div>
            <div className="recipe-stat-item">
              <div className="recipe-stat-label">Portions</div>
              <div className="recipe-stat-value">{recipe.servings || '-'}</div>
            </div>
            <div className="recipe-stat-item">
              <div className="recipe-stat-label">Calories</div>
              <div className="recipe-stat-value">{recipe.calories || 0} kcal</div>
            </div>
          </div>

          {/* Description */}
          <div className="recipe-section">
            <h2 className="recipe-section-title">Description</h2>
            <p className="recipe-description">{recipe.description}</p>
          </div>

          {/* Instructions */}
          <div className="recipe-section">
            <h2 className="recipe-section-title">Instructions</h2>
            <div className="recipe-instructions">
              {recipe.instructions}
            </div>
          </div>
        </div>
      </div>

      <div className="back-button-container">
        <Link href="/" className="cta-button">
          Retour aux recettes
        </Link>
      </div>
    </div>
  );
}