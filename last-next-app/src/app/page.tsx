"use client";
import { useState, useEffect } from "react";
import { api } from "@/api/api";

export default function APITest() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [recipeId, setRecipeId] = useState("");
  const [favoriteRecipeId, setFavoriteRecipeId] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const testLogin = async () => {
    const res = await api.auth.login(username, password);
    if (res.token) {
      setToken(res.token);
    }
    setOutput(res);
  };

  const testLogout = async () => {
    if (!token) return;
    try {
      await api.auth.logout(token);
      setToken("");
      setOutput({ status: "success", message: "Déconnexion réussie" });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setOutput({ status: "error", message: "Erreur lors de la déconnexion" });
    }
  };

  const testGetRecipes = async () => {
    try {
      const res = await api.recipes.getAll();
      if (res.data) {
        setOutput(res.data);
      } else {
        setOutput(res);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des recettes:", error);
      setOutput({ status: "error", message: "Erreur lors de la récupération des recettes" });
    }
  };

  const testGetRecipe = async () => {
    if (!recipeId) return;
    const res = await api.recipes.getOne(recipeId);
    setOutput(res);
  };

  const testGetFavorites = async () => {
    if (!token) return;
    const res = await api.favorites.getFavorites(token);
    setOutput(res);
  };

  const testAddFavorite = async () => {
    if (!token || !favoriteRecipeId) return;
    const res = await api.favorites.addFavorite(token, username, favoriteRecipeId);
    setOutput(res);
  };

  const testDeleteFavorite = async () => {
    if (!token || !favoriteRecipeId) return;
    const res = await api.favorites.removeFavorite(token, username, favoriteRecipeId);
    setOutput(res);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Test API Gourmet</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={testLogin}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={testLogout} 
              disabled={!token}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <button 
            onClick={testGetRecipes}
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Get Recipes
          </button>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Recipe ID" 
              value={recipeId} 
              onChange={(e) => setRecipeId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
            />
            <button 
              onClick={testGetRecipe}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Get Recipe
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <button 
            onClick={testGetFavorites} 
            disabled={!token}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Favorites
          </button>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Recipe ID" 
              value={favoriteRecipeId} 
              onChange={(e) => setFavoriteRecipeId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
            />
            <button 
              onClick={testAddFavorite} 
              disabled={!token}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Favorite
            </button>
            <button 
              onClick={testDeleteFavorite} 
              disabled={!token}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Favorite
            </button>
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-md">
          <pre className="whitespace-pre-wrap break-words text-sm">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
