import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('authToken') || null;
  });

  const login_ = (token) => {
    const now = new Date();
    const expiryTime = new Date(now.getTime() + 10 * 60 * 1000); // Expires in 3 hours
    localStorage.setItem('authToken', token);
    localStorage.setItem('expiry', expiryTime.toJSON());
    setAuthToken(token);
  };

  const logout = async () => {
    if (!authToken) return; // Si pas de token, inutile de faire un appel API

    try {
      const response = await fetch("https://gourmet.cours.quimerch.com/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`, // Envoie du token pour authentifier la requête
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la déconnexion: ${response.statusText}`);
      }

      console.log("Déconnexion réussie !");
    } catch (error) {
      console.error("Erreur API Logout:", error);
    }

    // Nettoyer le stockage local même si l'API échoue
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiry');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('expiry');

    if (!token || !expiry) {
      logout(); // No token or expiry found, force logout
      return;
    }

    const expiryDate = new Date(expiry);
    if (expiryDate < new Date()) {
      logout(); // Token expired, logout user
    } else {
      setAuthToken(token);
    }
  }, []); // Exécute une seule fois au chargement

  return (
    <AuthContext.Provider value={{ authToken, login_, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
