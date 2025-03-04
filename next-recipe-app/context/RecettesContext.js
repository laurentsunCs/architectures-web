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

      try {
        // Mise à jour optimiste
        setRecettes((prev) =>
          prev.map((recipe) =>
            recipe.id === recipeId
              ? { ...recipe, isFavorite: !recipe.isFavorite }
              : recipe
          )
        );

        // Appel API réel
        if (isCurrentlyFavorite) {
          // Supprimer des favoris
          await axios.delete(`${API_URL}/users/${user.username}/favorites`, {
            headers: { Authorization: `Bearer ${user.token}` },
            data: { recipe_id: recipeId }, // Spécifique à axios pour DELETE
          });
        } else {
          // Ajouter aux favoris
          await axios.post(
            `${API_URL}/users/${user.username}/favorites`,
            { recipe_id: recipeId },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }

        // Rafraîchir les données
        const { data } = await axios.get(
          `${API_URL}/users/${user.username}/favorites`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        setRecettes((prev) =>
          prev.map((recipe) => ({
            ...recipe,
            isFavorite: data.some((fav) => fav.id === recipe.id),
          }))
        );
      } catch (error) {
        console.error("Erreur API:", error.response?.data);
        // Annuler la mise à jour optimiste
        setRecettes((prev) =>
          prev.map((recipe) =>
            recipe.id === recipeId
              ? { ...recipe, isFavorite: isCurrentlyFavorite }
              : recipe
          )
        );
      }
    },
    [isAuthenticated, user, recettes, router]
  );

  const getFavoriteCount = useCallback(async (recipeId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/recipes/${recipeId}/stars/fake`
      );
      return data.count;
    } catch (error) {
      console.error("Erreur de récupération du compteur:", error);
      return 0;
    }
  }, []);

  const value = useMemo(
    () => ({
      recettes,
      setRecettes,
      toggleFavorite,
      getFavoriteCount,
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
