// api.ts - Fichier pour lister tous les appels API
export const API_BASE_URL = "https://gourmet.cours.quimerch.com";

const jsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const authOnlyHeader = (token: string) => ({
  'Authorization': `Bearer ${token}`,
});

const authJsonHeaders = (token: string) => ({
  ...jsonHeaders,
  'Authorization': `Bearer ${token}`,
});

// Fonction utilitaire pour gérer les réponses
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    throw new Error(`Erreur HTTP: ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  const text = await res.text();

  if (contentType && contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      console.warn("La réponse indique du JSON mais n'a pas pu être parsée");
    }
  }

  try {
    // Essayer de parser comme JSON même si le content-type ne l'indique pas
    return JSON.parse(text);
  } catch {
    // Si ce n'est pas du JSON, retourner le texte brut
    return { status: "success", data: text };
  }
};

export const api = {
  auth: {
    login: async (username: string, password: string) =>
      fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ username, password }),
      }).then(handleResponse),

    logout: async (token: string) =>
      fetch(`${API_BASE_URL}/logout`, {
        method: "GET",
        headers: authOnlyHeader(token),
      }).then(handleResponse),

    me: async (token: string) =>
      fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: authJsonHeaders(token),
      }).then(handleResponse),
  },

  favorites: {
    getFavorites: async (token: string) =>
      fetch(`${API_BASE_URL}/favorites`, {
        method: "GET",
        headers: authJsonHeaders(token),
      }).then(handleResponse),

    addFavorite: async (token: string, username: string, recipeID: string) =>
      fetch(`${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeID}`, {
        method: "POST",
        headers: authJsonHeaders(token),
      }).then(handleResponse),

    removeFavorite: async (token: string, username: string, recipeID: string) =>
      fetch(`${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeID}`, {
        method: "DELETE",
        headers: authJsonHeaders(token),
      }).then(handleResponse),
  },

  recipes: {
    getAll: async () =>
      fetch(`${API_BASE_URL}/recipes`, {
        method: "GET",
        headers: jsonHeaders,
      }).then(handleResponse),

    getOne: async (id: string) =>
      fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: "GET",
        headers: jsonHeaders,
      }).then(handleResponse),

    getRelated: async (id: string) =>
      fetch(`${API_BASE_URL}/recipes/${id}/related`, {
        method: "GET",
        headers: jsonHeaders,
      }).then(handleResponse),

    getStars: async (id: string) =>
      fetch(`${API_BASE_URL}/recipes/${id}/stars`, {
        method: "GET",
        headers: jsonHeaders,
      }).then(handleResponse),
  },
};