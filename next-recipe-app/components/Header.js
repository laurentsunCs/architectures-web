// components/Header.js
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <header className="site-header">
      <nav className="nav-container">
        {/* Partie gauche */}
        <div className="nav-left">
          <Link href="/" className="nav-link">
            Recettes
          </Link>
          <Link href="/favorites" className="nav-link">
            Favoris
          </Link>
        </div>

        {/* Partie droite */}
        <div className="nav-right">
          {isAuthenticated ? (
            <div
              className="user-menu"
              onClick={() => setShowLogout(!showLogout)}
            >
              <span className="username">{user?.username}</span>

              {showLogout && (
                <div className="logout-dropdown">
                  <button onClick={logout} className="logout-button">
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="nav-link">
              Connexion
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
