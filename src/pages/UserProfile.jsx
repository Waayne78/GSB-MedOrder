import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import "../styles/UserProfile.css";
import authService from "../services/authService";
import {
  FaUser,
  FaEnvelope,
  FaUserMd,
  FaSignOutAlt,
  FaCheck,
  FaExclamationCircle,
} from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [notification, setNotification] = useState(null);

  // Vérification de l'authentification
  const checkAuth = () => {
    try {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const currentUser = authService.getCurrentUser();
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
    checkAuth();
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      authService.logout();
      navigate("/login");
      window.location.reload();
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

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
  if (!user) {
    return (
      <div className="error-container">
        <h2>Impossible de charger les informations utilisateur</h2>
        <button className="btn-primary" onClick={() => navigate("/login")}>
          Se connecter
        </button>
      </div>
    );
  }
  return (
    <div className="profile-page">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === "success" ? (
            <FaCheck />
          ) : (
            <FaExclamationCircle />
          )}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <FaTimes />
          </button>
        </div>
      )}
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-container">
            <h2 className="profile-name">
              {user.firstname || "Prénom"} {user.lastname || "Nom"}
            </h2>
          </div>
          <nav className="profile-nav">
            <ul>
              <li className={activeTab === "profile" ? "active" : ""}>
                <button onClick={() => setActiveTab("profile")}>
                  <FaUser /> Profil
                </button>
              </li>
              <li className="logout-item">
                <button onClick={handleLogout}>
                  <FaSignOutAlt /> Déconnexion
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="profile-content">
          {activeTab === "profile" && (
            <div className="profile-tab">
              <div className="profile-header">
                <h1>Profil Utilisateur</h1>
              </div>

              <div className="profile-card">
                <h2 className="card-title">Informations personnelles</h2>
                <div className="card-content">
                  <div className="details-grid">
                    <div className="detail-item">
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

                    <div className="detail-item">
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

                    <div className="detail-item">
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

                    <div className="detail-item">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
