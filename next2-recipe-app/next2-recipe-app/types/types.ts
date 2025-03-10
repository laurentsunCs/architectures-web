export interface Recipe {
  id: string;
  name: string;
  description: string;
  image_url: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  cost: number;
  category: string;
  when_to_eat: string;
  created_by: string;
  created_at: string;
  published: boolean;
  disclaimer: string;
}

export interface LoginResponse {
  token: string;
}

// Types liés aux favoris
export interface Favorite {
  recipe: Recipe;
}

// Types liés aux réponses de l'API
export interface FavoriteAddResponse {
  message: string;
  favorite: Favorite;
}

// Types pour les vues simplifiées
export interface SimpleRecipe {
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

export interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}