import React, { createContext, useContext, useState, useEffect } from 'react';

// Crée un contexte pour les informations utilisateur
const UserContext = createContext(null);

// Crée un fournisseur de contexte pour partager les informations utilisateur
export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    // Essayer de récupérer les informations utilisateur depuis le localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });

  // Fonction pour récupérer les informations de l'utilisateur depuis l'API
  const fetchUserInfo = async (authToken) => {
    try {
      const url = "https://gourmet.cours.quimerch.com/me";
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }

      const data = await response.json();
      // Stocker les données dans le localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data); // Met à jour l'état avec les nouvelles informations
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Si un token est présent, récupérer les informations de l'utilisateur
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      fetchUserInfo(authToken);
    }
  }, []); // L'effet s'exécute uniquement au montage du composant


  return (
    <UserContext.Provider value={{ userInfo, fetchUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour accéder aux informations utilisateur dans les composants
export const useUser = () => {
  return useContext(UserContext);
};
