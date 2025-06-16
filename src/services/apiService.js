import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:3006/api';

// Création d'une instance Axios avec une configuration de base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    const token = user?.token; // ou user?.accessToken selon ton projet
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
apiClient.interceptors.response.use(
  (response) => {
    localStorage.setItem("token", response.data.token);
    return response;
  },
  (error) => {
    // Gestion des erreurs 401 (non autorisé)
    if (error.response && error.response.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service API avec méthodes pour effectuer des requêtes
const apiService = {
  // Méthode GET
  get: async (url, params = {}) => {
    try {
      // Récupère le token depuis le localStorage ou le service d'auth
      const user = authService.getCurrentUser();
      const token = user?.token || localStorage.getItem("token");
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const response = await apiClient.get(url, { params, headers });
      return response;
    } catch (error) {
      console.error(`Erreur lors de la requête GET à ${url}:`, error);
      throw error;
    }
  },

  // Méthode POST
  post: async (url, data = {}) => {
    try {
      const response = await apiClient.post(url, data);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la requête POST à ${url}:`, error);
      throw error;
    }
  },

  // Méthode PUT
  put: async (url, data = {}) => {
    try {
      const response = await apiClient.put(url, data);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la requête PUT à ${url}:`, error);
      throw error;
    }
  },

  // Méthode DELETE
  delete: async (url) => {
    try {
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la requête DELETE à ${url}:`, error);
      throw error;
    }
  }
};

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem(USER_KEY));
  const token = localStorage.getItem("token");
  if (user && token) {
    return { ...user, token };
  }
  return null;
};

export default apiService;