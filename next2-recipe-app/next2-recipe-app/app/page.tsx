import axios from 'axios';
import Link from 'next/link';
import { Recipe } from '../types/types';
import { FavoriteButton } from '../components/FavoriteButton';

export default async function HomePage() {
  const recipes = await fetchRecipes();

  async function fetchRecipes(): Promise<Recipe[]> {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
      return response.data as Recipe[];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Nos Recettes</h1>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
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
                <FavoriteButton recipeId={recipe.id} />
              </div>
              <div className="recipe-content">
                <h2 className="recipe-title">{recipe.name}</h2>
                <p className="recipe-description">{recipe.description}</p>
                <div className="recipe-meta">
                  <span className="meta-item">⏱️ {recipe.prep_time} min</span>
                  <span className="meta-item"> 🔥 {recipe.calories} kcal</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}