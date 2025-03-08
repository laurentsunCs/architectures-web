'use client';

import { useRouter } from 'next/navigation';

export const LoginRedirect = () => {
  const router = useRouter();

  const redirectToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/login?message=Connectez-vous pour gérer vos favoris');
  };

  return (
    <button
      onClick={redirectToLogin}
      className="favorite-button"
      aria-label="Se connecter pour ajouter aux favoris"
    >
      ♡
    </button>
  );
}; 