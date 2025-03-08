// [
//     {
//       "calories": 0,
//       "category": "string",
//       "cook_time": 0,
//       "cost": 0,
//       "created_at": "2019-08-24T14:15:22Z",
//       "created_by": "string",
//       "description": "string",
//       "disclaimer": "string",
//       "id": "string",
//       "image_url": "string",
//       "instructions": "string",
//       "name": "string",
//       "prep_time": 0,
//       "published": true,
//       "servings": 0,
//       "when_to_eat": "string"
//     }
//   ]
export interface Recipe {
    id: string;
    name: string;
    description: string;
    image_url: string;
    cook_time: number;
    cost: number;
    disclaimer: string;
    instructions: string;
    prep_time: number;
    published: boolean;
    servings: number;
    when_to_eat: string;
    calories: number;
}

export interface User {
    token: string;
    usernmae: string;
    password: string;
    favoriteRecipes: string[];
}