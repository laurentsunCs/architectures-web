import React, { useState } from "react";
import "./Login.css";

function Login() {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null); // Pour stocker le token reçu

    async function login() {
        const url = "https://gourmet.cours.quimerch.com/login";
        setLoading(true); // Afficher le chargement
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json, application/xml", // Correction de l'en-tête Accept
                    "Content-Type": "*/*", // Contenu attendu par l'API
                },
                body: JSON.stringify({ "username": user, "password": password }), // Corps de la requête
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erreur côté serveur:", data);
                throw new Error(`Erreur API : ${response.status} - ${data.message || 'Erreur inconnue'}`);
            }

            console.log("Données reçues :", data);
            setToken(data.token); // Sauvegarde le token dans l'état

        } catch (error) {
            console.error("Erreur API :", error.message);
            setError(error.message);
        } finally {
            setLoading(false); // Stopper le chargement
        }
    }

    const handleUserChange = (event) => {
        setUser(event.target.value);
    }

    const handlePwdChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!user || !password) {
            setError("Veuillez entrer un nom d'utilisateur et un mot de passe.");
            return;
        }
        login();
    };

    return (
        <div className="Login">
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="user">Email</label>
                <input type="text" id="user" value={user} onChange={handleUserChange} required />
                <label htmlFor="password">Mot de passe</label>
                <input type="password" id="password" value={password} onChange={handlePwdChange} required />
                <button type="submit" disabled={loading}>Connexion</button>
            </form>
            {error && <p>{error}</p>} {/* Afficher les erreurs */}
            {token && <p>Token reçu : {token}</p>} {/* Affichage du token si présent */}
        </div>
    );
}

export default Login;
