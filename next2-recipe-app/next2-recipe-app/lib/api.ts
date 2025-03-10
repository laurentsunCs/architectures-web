import { Recipe, LoginResponse, SimpleRecipe } from '../types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_URL}/recipes`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getRecipeWithErrorHandling(id: string): Promise<Recipe | null> {
  try {
    return await getRecipe(id);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export async function getFavorites(token: string): Promise<Recipe[]> {
  const response = await fetch(`${API_URL}/favorites`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const favorites = await response.json();
  return Array.isArray(favorites) ? favorites.map(fav => fav.recipe) : [];
}

export async function addFavorite(token: string, username: string, recipeId: string): Promise<void> {
  const response = await fetch(`${API_URL}/users/${username}/favorites`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipeID: recipeId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function removeFavorite(token: string, username: string, recipeId: string): Promise<void> {
  const response = await fetch(`${API_URL}/users/${username}/favorites?recipeId=${recipeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function getSimpleRecipe(id: string): Promise<SimpleRecipe | null> {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const recipe = await response.json();
  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    image_url: recipe.image_url,
    prep_time: recipe.prep_time,
    cook_time: recipe.cook_time,
    servings: recipe.servings,
    calories: recipe.calories,
    cost: recipe.cost,
    instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions
  };
}

export async function getSimpleRecipeWithErrorHandling(id: string): Promise<SimpleRecipe | null> {
  try {
    return await getSimpleRecipe(id);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
} 