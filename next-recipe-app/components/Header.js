// components/Header.js
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <header className="site-header">
      <nav className="nav-container">
        <Link
          href="/"
          className={`nav-link ${router.pathname === "/" ? "active" : ""}`}
        >
          Recettes
        </Link>
        <Link
          href="/favorites"
          className={`nav-link ${
            router.pathname === "/favorites" ? "active" : ""
          }`}
        >
          Favoris
        </Link>
        <Link
          href="/login"
          className={`nav-link ${router.pathname === "/login" ? "active" : ""}`}
        >
          Connexion
        </Link>
      </nav>
    </header>
  );
}
