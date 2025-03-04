// context/AuthContext.js
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const AuthContext = createContext();
//const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = "https://gourmet.cours.quimerch.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Optionnel: Vérifier la validité du token
        setUser({ token }); // Vous pouvez ajouter plus d'infos utilisateur si l'API le permet
      }
    } catch (error) {
      console.error("Erreur de vérification auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    if (username === "test" && password === "test") {
      localStorage.setItem("authToken", "fake-token");
      setUser({ token: "fake-token" });
      return { success: true };
    }
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      localStorage.setItem("authToken", response.data.token);
      setUser({ token: response.data.token });
      return { success: true };
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Identifiants incorrects",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/logout`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user?.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
