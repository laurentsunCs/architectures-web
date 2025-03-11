import React from "react";
import { useAuth } from "../../Common/AuthProvider/AuthProvider";
import "./Logout.css";

function Logout() {
  const { logout } = useAuth(); // Récupère la fonction logout du contexte d'authentification

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout(); // Appelle la fonction logout qui gère la déconnexion
      alert("Vous êtes déconnecté avec succès."); // Message de confirmation (tu peux le personnaliser)
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <div className="Logout">
      <button onClick={handleLogout} className="logout-button">Se déconnecter</button>
    </div>
  );
};

export default Logout;
