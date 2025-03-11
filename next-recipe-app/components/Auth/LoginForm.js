//components/Auth/LoginForm.js
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [username, setUsername] = useState(""); // Changement de email à username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // Utilisation du contexte d'authentification

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        // Redirection vers la page précédente ou l'accueil
        router.push(router.query.redirect || "/");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="username">Nom d'utilisateur</label>{" "}
        {/* Changement de label */}
        <input
          type="text" // Type text au lieu de email
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  );
}
