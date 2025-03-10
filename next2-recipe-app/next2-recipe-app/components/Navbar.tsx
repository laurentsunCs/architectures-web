// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/" className="hover:text-gray-300">
              Accueil
            </Link>
            <Link 
              href={token ? "/favorites" : "/login?message=Connectez-vous pour voir vos favoris"} 
              className="hover:text-gray-300"
            >
              Favoris {!token && '🔒'}
            </Link>
          </div>
          <div>
            {token ? (
              <button
                onClick={logout}
                className="hover:text-gray-300"
              >
                Déconnexion
              </button>
            ) : (
              <Link href="/login" className="hover:text-gray-300">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}