// src/context/LoadingContext.js
import React, { createContext, useState, useContext } from "react";

// Créer un contexte avec une valeur par défaut (false pour loading)
const LoadingContext = createContext();

// Fournisseur du contexte
export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  function recipeLoaded(loadingStatus) {
    setLoading(loadingStatus);
  }

  return (
    <LoadingContext.Provider value={{ loading, recipeLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useLoading() {
  return useContext(LoadingContext);
}
