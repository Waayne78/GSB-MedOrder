import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import "../styles/UserProfile.css";
import authService from "../services/authService";
import orderService from "../services/orderService";
import {
  FaUser,
  FaEnvelope,
  FaUserMd,
  FaSignOutAlt,
  FaCheck,
  FaExclamationCircle,
  FaEdit,
  FaShieldAlt,
  FaHistory,
  FaCog,
  FaBell,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaSave,
  FaTimesCircle,
  FaUserCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaTruck,
  FaBox,
  FaStar,
  FaChartLine
} from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [notification, setNotification] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageRating: 0,
    lastOrder: null
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Vérification de l'authentification
  const checkAuth = () => {
    try {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setEditForm({
          firstname: currentUser.firstname || "",
          lastname: currentUser.lastname || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || ""
        });
        
        // Charger les statistiques des commandes
        loadUserStats(currentUser.id);
      }

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      setLoading(false);
    }
  };

  // Charger les statistiques des commandes
  const loadUserStats = async (userId) => {
    try {
      setStatsLoading(true);
      const userStats = await orderService.getUserOrderStats(userId);
      setStats(userStats);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      showNotification("error", "Impossible de charger les statistiques des commandes");
    } finally {
      setStatsLoading(false);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || ""
    });
  };

  const handleSave = () => {
    // Ici vous pouvez ajouter la logique pour sauvegarder les modifications
    showNotification("success", "Profil mis à jour avec succès !");
    setIsEditing(false);
    // Mettre à jour l'utilisateur localement
    setUser({ ...user, ...editForm });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getInitials = (firstname, lastname) => {
    const first = firstname ? firstname.charAt(0).toUpperCase() : "";
    const last = lastname ? lastname.charAt(0).toUpperCase() : "";
    return first + last;
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': '#dc3545',
      'pharmacist': '#28a745',
      'practitioner': '#007bff',
      'user': '#6c757d'
    };
    return colors[role] || '#6c757d';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Aucune commande";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
          {notification.type === "success" ? <FaCheck /> : <FaExclamationCircle />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-header-card">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                <div className="avatar-initials">
                  {getInitials(user.firstname, user.lastname)}
                </div>
              )}
            </div>
            <h2 className="profile-name">
              {user.firstname || "Prénom"} {user.lastname || "Nom"}
            </h2>
            <div 
              className="role-badge"
              style={{ backgroundColor: getRoleColor(user.role) }}
            >
              {user.role || "Utilisateur"}
            </div>
            <p className="profile-email">{user.email}</p>
          </div>

          <nav className="profile-nav">
            <ul>
              <li className={activeTab === "overview" ? "active" : ""}>
                <button onClick={() => setActiveTab("overview")}>
                  <FaUser /> Vue d'ensemble
                </button>
              </li>
              <li className={activeTab === "orders" ? "active" : ""}>
                <button onClick={() => setActiveTab("orders")}>
                  <FaHistory /> Commandes
                </button>
              </li>
              <li className={activeTab === "security" ? "active" : ""}>
                <button onClick={() => setActiveTab("security")}>
                  <FaShieldAlt /> Sécurité
                </button>
              </li>
              <li className={activeTab === "settings" ? "active" : ""}>
                <button onClick={() => setActiveTab("settings")}>
                  <FaCog /> Paramètres
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

        {/* Contenu principal */}
        <div className="profile-content">
          {/* Vue d'ensemble */}
          {activeTab === "overview" && (
            <div className="profile-tab">
              <div className="tab-header">
                <h1>Vue d'ensemble</h1>
                <button className="btn-edit" onClick={handleEdit}>
                  <FaEdit /> Modifier le profil
                </button>
              </div>

              {/* Statistiques */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaBox />
                  </div>
                  <div className="stat-content">
                    <h3>{statsLoading ? "..." : stats.totalOrders}</h3>
                    <p>Commandes totales</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon money">
                    <FaCreditCard />
                  </div>
                  <div className="stat-content">
                    <h3>{statsLoading ? "..." : `${stats.totalSpent.toFixed(2)} €`}</h3>
                    <p>Total dépensé</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaStar />
                  </div>
                  <div className="stat-content">
                    <h3>{statsLoading ? "..." : stats.averageRating}</h3>
                    <p>Note moyenne</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaTruck />
                  </div>
                  <div className="stat-content">
                    <h3>{statsLoading ? "..." : formatDate(stats.lastOrder)}</h3>
                    <p>Dernière commande</p>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="profile-card">
                <div className="card-header">
                  <h2>Informations personnelles</h2>
                </div>
                <div className="card-content">
                  {isEditing ? (
                    <div className="edit-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Prénom</label>
                          <input
                            type="text"
                            name="firstname"
                            value={editForm.firstname}
                            onChange={handleInputChange}
                            placeholder="Votre prénom"
                          />
                        </div>
                        <div className="form-group">
                          <label>Nom</label>
                          <input
                            type="text"
                            name="lastname"
                            value={editForm.lastname}
                            onChange={handleInputChange}
                            placeholder="Votre nom"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          placeholder="votre.email@exemple.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Téléphone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div className="form-group">
                        <label>Adresse</label>
                        <textarea
                          name="address"
                          value={editForm.address}
                          onChange={handleInputChange}
                          placeholder="Votre adresse complète"
                          rows="3"
                        />
                      </div>
                      <div className="form-actions">
                        <button className="btn-cancel" onClick={handleCancel}>
                          <FaTimesCircle /> Annuler
                        </button>
                        <button className="btn-save" onClick={handleSave}>
                          <FaSave /> Sauvegarder
                        </button>
                      </div>
                    </div>
                  ) : (
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
                          <FaPhone />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Téléphone</span>
                          <span className="detail-value">
                            {user.phone || "Non spécifié"}
                          </span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <div className="detail-icon">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Adresse</span>
                          <span className="detail-value">
                            {user.address || "Non spécifié"}
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
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Onglet Commandes */}
          {activeTab === "orders" && (
            <div className="profile-tab">
              <div className="tab-header">
                <h1>Historique des commandes</h1>
              </div>
              <div className="orders-container">
                <p>Fonctionnalité en cours de développement...</p>
              </div>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === "security" && (
            <div className="profile-tab">
              <div className="tab-header">
                <h1>Sécurité du compte</h1>
              </div>
              <div className="security-container">
                <p>Fonctionnalité en cours de développement...</p>
              </div>
            </div>
          )}

          {/* Onglet Paramètres */}
          {activeTab === "settings" && (
            <div className="profile-tab">
              <div className="tab-header">
                <h1>Paramètres</h1>
              </div>
              <div className="settings-container">
                <p>Fonctionnalité en cours de développement...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
