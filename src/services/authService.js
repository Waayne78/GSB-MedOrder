import axios from 'axios';

const API_URL = 'http://localhost:3006/api/auth';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Fonction pour déclencher un événement d'authentification
const triggerAuthChange = () => {
  window.dispatchEvent(new Event('auth-change'));
};

// Fonction d'initialisation qui vérifie si le token stocké est toujours valide
const initialize = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    // Vérifier si le token est expiré
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // Convertir en millisecondes
      
      if (Date.now() >= expirationTime) {
        // Le token est expiré, déconnecter l'utilisateur
        logout();
        return false;
      }
      return true;
    } catch (error) {
      // Si le token ne peut pas être décodé, il est probablement invalide
      logout();
      return false;
    }
  }
  return false;
};

const authService = {
  // Initialiser le service d'authentification
  initialize() {
    try {
      // Vérifier si l'utilisateur est déjà connecté
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      if (token && user) {
        // Vérifier si le token est expiré
        try {
          const tokenData = this.parseJwt(token);
          if (tokenData && tokenData.exp * 1000 < Date.now()) {
            // Token expiré, déconnecter l'utilisateur
            this.logout();
            return false;
          }
          return true;
        } catch (e) {
          // Token invalide, déconnecter l'utilisateur
          console.warn("Token invalide, déconnexion de l'utilisateur");
          this.logout();
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de authService:', error);
      return false;
    }
  },
  
  // Connexion utilisateur
  login(email, password) {
    return fetch('http://localhost:3006/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Identifiants invalides');
        }
        throw new Error('Erreur lors de la connexion');
      }
      return response.json();
    })
    .then(data => {
      // Sauvegarder le token et les infos utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Émettre un événement pour informer les autres composants
      window.dispatchEvent(new Event('storage'));
      
      return data.user;
    });
  },
  
  // Inscription utilisateur
  register(email, password, firstname, lastname) {
    return fetch('http://localhost:3006/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, firstname, lastname })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Cet email est déjà utilisé');
        }
        throw new Error('Erreur lors de l\'inscription');
      }
      return response.json();
    })
    .then(data => {
      // Sauvegarder le token et les infos utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Émettre un événement pour informer les autres composants
      window.dispatchEvent(new Event('storage'));
      
      return data.user;
    });
  },
  
  // Déconnexion utilisateur
  logout() {
    // Supprimer les données d'authentification du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Émettre un événement pour informer les autres composants
    window.dispatchEvent(new Event('storage'));
  },
  
  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      if (!token || !user) {
        return false;
      }
      
      // Vérifier si le token est expiré
      try {
        const tokenData = this.parseJwt(token);
        if (tokenData && tokenData.exp * 1000 < Date.now()) {
          // Token expiré, déconnecter l'utilisateur
          this.logout();
          return false;
        }
        return true;
      } catch (e) {
        // Token invalide, déconnecter l'utilisateur
        console.warn("Token invalide, déconnexion de l'utilisateur");
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      return false;
    }
  },
  
  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },
  
  // Obtenir le token d'authentification
  getToken() {
    return localStorage.getItem('token');
  },
  
  // Parser le token JWT pour obtenir les données
  parseJwt(token) {
    try {
      // Vérifier si le token est valide et contient au moins deux parties séparées par un point
      if (!token || token.split('.').length < 2) {
        throw new Error('Format de token invalide');
      }
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // S'assurer que la longueur est un multiple de 4
      const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      
      // Décoder en toute sécurité
      try {
        const jsonPayload = decodeURIComponent(
          atob(paddedBase64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error('Erreur lors du décodage du token:', e);
        throw new Error('Impossible de décoder le token');
      }
    } catch (error) {
      console.error('Erreur lors du parsing du token JWT:', error);
      return null;
    }
  }
};

// Initialiser l'en-tête d'autorisation si un token existe
const token = localStorage.getItem(TOKEN_KEY);
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default authService;