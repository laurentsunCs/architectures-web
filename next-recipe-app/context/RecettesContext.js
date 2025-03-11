// context/RecettesContext.js
import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import { useAuth } from "./AuthContext";
import axios from "axios";

const RecettesContext = createContext();
//const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = "https://gourmet.cours.quimerch.com";

export function RecettesProvider({ children, initialRecettes }) {
  const [recettes, setRecettes] = useState(initialRecettes || []);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth(); // Déplacé au niveau du composant

  const toggleFavorite = useCallback(
    async (recipeId) => {
      if (!isAuthenticated || !user) {
        router.push(
          `/login?message=${encodeURIComponent(
            "Connectez-vous pour gérer vos favoris"
          )}`
        );
        return;
      }

      const currentRecipe = recettes.find((r) => r.id === recipeId);
      const isCurrentlyFavorite = currentRecipe?.isFavorite;

      let config;
      // Vérification côté client avant l'appel API
      if (isCurrentlyFavorite) {
        return; // Déjà en favoris, ne rien faire
      }

      try {
        // Lock UI pendant la requête
        setRecettes((prev) =>
          prev.map((recipe) =>
            recipe.id === recipeId ? { ...recipe, isUpdating: true } : recipe
          )
        );

        config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: "application/json",
          },
          params: { recipeID: recipeId },
        };

        // Vérification finale côté serveur avant l'ajout
        const { data: existingFavorites } = await axios.get(
          `${API_URL}/users/${user.username}/favorites`,
          config
        );

        if (existingFavorites.some((fav) => fav.recipe_id === recipeId)) {
          throw new Error("Déjà en favoris");
        }

        await axios.post(
          `${API_URL}/users/${user.username}/favorites`,
          {},
          config
        );

        // Mise à jour finale
        setRecettes((prev) =>
          prev.map((recipe) =>
            recipe.id === recipeId
              ? { ...recipe, isFavorite: true, isUpdating: false }
              : recipe
          )
        );
      } catch (error) {
        console.error("Erreur API:", error.response?.data);
        // Reset + resync avec le serveur
        if (config) {
          const { data: favorites } = await axios.get(
            `${API_URL}/users/${user.username}/favorites`,
            config
          );

          setRecettes((prev) =>
            prev.map((recipe) => ({
              ...recipe,
              isFavorite: favorites.some((fav) => fav.recipe_id === recipe.id),
              isUpdating: false,
            }))
          );
        }
      }
    },
    [isAuthenticated, user, recettes, router]
  );

  const value = useMemo(
    () => ({
      recettes,
      setRecettes,
      toggleFavorite,
      //getFavoriteCount,
    }),
    [recettes, toggleFavorite]
  );

  return (
    <RecettesContext.Provider value={value}>
      {children}
    </RecettesContext.Provider>
  );
}

export function useRecettes() {
  const context = useContext(RecettesContext);
  if (!context) {
    throw new Error("useRecettes must be used within a RecettesProvider");
  }
  return context;
}
