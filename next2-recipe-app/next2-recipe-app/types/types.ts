export interface Recipe {
  id: string;
  name: string;
  description: string;
  image_url: string;
  ingredients: string[];
  instructions: string[];
  preparation_time: number;
  cooking_time: number;
  servings: number;
}

// ... rest of existing types ... 