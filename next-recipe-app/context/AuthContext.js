// context/AuthContext.js
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const AuthContext = createContext();
//const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = "https://gourmet.cours.quimerch.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const username = localStorage.getItem("username");
      if (token && username) {
        setUser({ token, username });
      }
    } catch (error) {
      console.error("Erreur de vérification auth:", error);
    } finally {
      if (!user) {
        router.push("/login");
      }
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, application/xml",
          },
        }
      );

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("username", username);
      setUser({
        token: response.data.token,
        username,
      });

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
      if (user?.token) {
        await axios.get(`${API_URL}/logout`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
