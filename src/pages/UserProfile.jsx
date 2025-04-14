import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "../styles/UserProfile.css";
import authService from "../services/authService";
// Importez des icônes
import { FaUser, FaEnvelope, FaIdCard, FaUserMd } from "react-icons/fa";

const UserProfile = () => {
  // État local pour stocker les informations utilisateur
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction pour récupérer les initiales de l'utilisateur
  const getInitials = () => {
    if (!user || !user.firstname || !user.lastname) return "?";
    return `${user.firstname.charAt(0)}${user.lastname.charAt(
      0
    )}`.toUpperCase();
  };

  // Fonction pour vérifier l'authentification et récupérer les données utilisateur
  const checkAuth = () => {
    try {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const currentUser = authService.getCurrentUser();
        console.log("Utilisateur récupéré:", currentUser);
        setUser(currentUser);
      }

      setLoading(false);
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier l'authentification au chargement du composant
    checkAuth();

    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, []);

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  // Si l'utilisateur n'est pas chargé
  if (!user) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h2>Impossible de charger les informations utilisateur</h2>
        <p>Veuillez vous reconnecter ou réessayer plus tard.</p>
      </div>
    );
  }

  // Déterminer la couleur de fond de l'avatar en fonction du rôle
  const getRoleColor = () => {
    switch (user.role?.toLowerCase()) {
      case "pharmacien":
        return "#4CAF50"; // Vert
      case "admin":
        return "#2196F3"; // Bleu
      default:
        return "#9C27B0"; // Violet par défaut
    }
  };

  return (
    <div className="profile-container">
      <div
        className="profile-header"
        style={{ backgroundColor: getRoleColor() + "22" }}
      >
        <div
          className="profile-avatar"
          style={{
            backgroundColor: getRoleColor(),
            boxShadow: `0 8px 16px ${getRoleColor()}44`,
          }}
        >
          <div className="avatar-initials">{getInitials()}</div>
        </div>
        <div className="profile-info">
          <h1>
            {user.firstname || "Prénom"} {user.lastname || "Nom"}
          </h1>
          <p className="email">{user.email || "email@example.com"}</p>
          <div
            className="role-badge"
            style={{ backgroundColor: getRoleColor() }}
          >
            {user.role || "Utilisateur"}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="user-details-card">
          <h2 className="card-title">Informations personnelles</h2>

          <div className="details-row">
            <div className="detail-icon">
              <FaUser />
            </div>
            <div className="detail-content">
              <span className="detail-label">Prénom</span>
              <span className="detail-value">
                {user.firstname || "Non spécifié"}
              </span>
            </div>
          </div>

          <div className="details-row">
            <div className="detail-icon">
              <FaUser />
            </div>
            <div className="detail-content">
              <span className="detail-label">Nom</span>
              <span className="detail-value">
                {user.lastname || "Non spécifié"}
              </span>
            </div>
          </div>

          <div className="details-row">
            <div className="detail-icon">
              <FaEnvelope />
            </div>
            <div className="detail-content">
              <span className="detail-label">Email</span>
              <span className="detail-value">
                {user.email || "Non spécifié"}
              </span>
            </div>
          </div>

          <div className="details-row">
            <div className="detail-icon">
              <FaUserMd />
            </div>
            <div className="detail-content">
              <span className="detail-label">Rôle</span>
              <span className="detail-value">
                {user.role || "Non spécifié"}
              </span>
            </div>
          </div>
        </div>

  
      </div>
    </div>
  );
};

export default UserProfile;
