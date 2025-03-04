// context/RecettesContext.js
import { createContext, useState, useContext, useMemo } from "react";

const RecettesContext = createContext();

// context/RecettesContext.js
export function RecettesProvider({ children, initialRecettes }) {
  const [recettes, setRecettes] = useState(initialRecettes || []);

  const toggleFavorite = (recipeId) => {
    setRecettes((prev) =>
      prev.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };

  const value = useMemo(
    () => ({
      recettes,
      setRecettes,
      toggleFavorite,
    }),
    [recettes]
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
