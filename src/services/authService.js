import axios from "axios";

const API_URL = "http://localhost:3006/api/users";
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Fonction pour déclencher un événement d'authentification
const triggerAuthChange = () => {
  window.dispatchEvent(new Event("auth-change"));
};

// Initialisation classique sans hook React
const initialize = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1])); // Décoder le payload du token JWT
      const expirationTime = tokenData.exp * 1000; // Convertir en millisecondes

      if (Date.now() >= expirationTime) {
        logout(); // Le token est expiré, déconnecter l'utilisateur
        return false;
      }
      return true; // Le token est valide
    } catch (error) {
      console.error("Erreur lors de l'initialisation de authService:", error);
      logout(); // Si le token est invalide, déconnecter l'utilisateur
      return false;
    }
  }
  return false; // Aucun token trouvé
};

// Connexion utilisateur
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, user } = response.data;

    // Sauvegarder le token et les infos utilisateur
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Ajouter le token aux en-têtes par défaut
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return user;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error.response?.data?.message || "Erreur lors de la connexion";
  }
};

// Inscription utilisateur
const register = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error.response?.data?.message || "Erreur lors de l'inscription";
  }
};

// Déconnexion utilisateur
const logout = () => {
  // Supprimer les données d'authentification du localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  // Supprimer le token des en-têtes par défaut
  delete axios.defaults.headers.common["Authorization"];

  // Déclencher un événement d'authentification
  triggerAuthChange();
};

// Vérifier si l'utilisateur est authentifié
const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return false;

  try {
    // Vérifier que le token est valide
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const isValid = tokenData.exp * 1000 > Date.now(); // Vérifier si le token est expiré

    // Stocker l'état d'authentification pour une récupération facile
    localStorage.setItem("isAuthenticated", isValid ? "true" : "false");

    return isValid;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification :",
      error
    );
    localStorage.setItem("isAuthenticated", "false");
    return false;
  }
};

// Obtenir l'utilisateur actuel
const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Obtenir le token d'authentification
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Parser le token JWT pour obtenir les données
const parseJwt = (token) => {
  try {
    if (!token || token.split(".").length < 2) {
      throw new Error("Format de token invalide");
    }

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erreur lors du parsing du token JWT :", error);
    return null;
  }
};

// Initialiser l'en-tête d'autorisation si un token existe
const token = localStorage.getItem(TOKEN_KEY);
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Exporter les fonctions
const authService = {
  initialize,
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken,
  parseJwt,
};

export default authService;
