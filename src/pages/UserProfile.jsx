import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import "../styles/UserProfile.css";
import authService from "../services/authService";
import { 
  FaUser, FaEnvelope, FaIdCard, FaUserMd, FaHistory, FaSignOutAlt, 
  FaClipboardList, FaEdit, FaShieldAlt, FaCheck, FaSave, 
  FaTimes, FaExclamationCircle, FaKey, FaCalendarAlt, FaAddressCard,
  FaPhone, FaMapMarkerAlt
} from "react-icons/fa";
import axios from "axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    lastOrder: null,
    favoriteCategory: ""
  });

  // Fonction pour récupérer les initiales de l'utilisateur
  const getInitials = () => {
    if (!user || !user.firstname || !user.lastname) return "?";
    return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
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
        setEditedUser({...currentUser});
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

  // Fonction pour récupérer les commandes récentes
  const fetchRecentOrders = async () => {
    if (!user || !user.id) return;

    setLoadingOrders(true);
    try {
      // Remarque: Ceci est un exemple, adaptez l'URL à votre backend
      const API_URL = "http://localhost:3006/api/commandes";
      const response = await axios.get(`${API_URL}/user/${user.id}?limit=3`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      setRecentOrders(response.data || []);

      // Calculer les statistiques
      if (response.data && response.data.length > 0) {
        const totalOrders = response.data.length;
        const totalSpent = response.data.reduce((sum, order) => sum + (order.total || 0), 0);
        const lastOrder = response.data.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        // Statistique factice pour l'exemple
        const favoriteCategory = "Analgésiques";

        setStats({
          totalOrders,
          totalSpent,
          lastOrder,
          favoriteCategory
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes récentes:", error);
      setRecentOrders([]);
    } finally {
      setLoadingOrders(false);
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

  useEffect(() => {
    if (user && user.id) {
      fetchRecentOrders();
    }
  }, [user]);

  const handleLogout = () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirmed) {
      authService.logout();
      navigate("/login");
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Si on quitte le mode édition, on réinitialise les valeurs
      setEditedUser({...user});
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = async () => {
    try {
      // Simulation d'une mise à jour réussie
      // Remplacez par un appel API réel
      setTimeout(() => {
        setUser(editedUser);
        setEditMode(false);
        showNotification("success", "Profil mis à jour avec succès !");
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      showNotification("error", "Erreur lors de la mise à jour du profil. Veuillez réessayer.");
    }
  };

  const changePassword = async () => {
    // Vérifier si les mots de passe correspondent
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    // Vérifier la complexité du mot de passe
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      // Simulation d'une mise à jour réussie
      // Remplacez par un appel API réel
      setChangingPassword(true);
      setTimeout(() => {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setChangingPassword(false);
        setPasswordError("");
        showNotification("success", "Mot de passe modifié avec succès !");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      setPasswordError("Erreur lors du changement de mot de passe. Veuillez réessayer.");
      setChangingPassword(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Déterminer la couleur de fond de l'avatar en fonction du rôle
  const getRoleColor = () => {
    switch (user?.role?.toLowerCase()) {
      case "pharmacien":
        return "#4CAF50"; // Vert
      case "admin":
        return "#2196F3"; // Bleu
      default:
        return "#9C27B0"; // Violet par défaut
    }
  };

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
          <button onClick={() => setNotification(null)}><FaTimes /></button>
        </div>
      )}
      
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-container">
            <div
              className="profile-avatar"
              style={{
                backgroundColor: getRoleColor(),
              }}
            >
              <div className="avatar-initials">{getInitials()}</div>
            </div>
            <h2 className="profile-name">
              {user.firstname || "Prénom"} {user.lastname || "Nom"}
            </h2>
            <div
              className="role-badge"
              style={{ backgroundColor: getRoleColor() }}
            >
              {user.role || "Utilisateur"}
            </div>
          </div>
          
          <nav className="profile-nav">
            <ul>
              <li className={activeTab === "profile" ? "active" : ""}>
                <button onClick={() => setActiveTab("profile")}>
                  <FaUser /> Profil
                </button>
              </li>
              <li className={activeTab === "orders" ? "active" : ""}>
                <button onClick={() => setActiveTab("orders")}>
                  <FaClipboardList /> Commandes
                </button>
              </li>
              <li className={activeTab === "security" ? "active" : ""}>
                <button onClick={() => setActiveTab("security")}>
                  <FaShieldAlt /> Sécurité
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
                <button className={`btn-edit ${editMode ? 'active' : ''}`} onClick={toggleEditMode}>
                  {editMode ? (
                    <>
                      <FaTimes /> Annuler
                    </>
                  ) : (
                    <>
                      <FaEdit /> Modifier
                    </>
                  )}
                </button>
              </div>

              {!editMode ? (
                <>
                  <div className="stats-cards">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FaClipboardList />
                      </div>
                      <div className="stat-info">
                        <h3>{stats.totalOrders}</h3>
                        <p>Commandes</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FaCalendarAlt />
                      </div>
                      <div className="stat-info">
                        <h3>{stats.lastOrder ? new Date(stats.lastOrder.date).toLocaleDateString('fr-FR') : 'N/A'}</h3>
                        <p>Dernière commande</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon money">
                        <span>€</span>
                      </div>
                      <div className="stat-info">
                        <h3>{stats.totalSpent.toFixed(2)} €</h3>
                        <p>Montant total</p>
                      </div>
                    </div>
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
                            <FaAddressCard />
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Adresse</span>
                            <span className="detail-value">
                              {user.address || "Non spécifié"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="profile-card">
                  <h2 className="card-title">Modifier vos informations</h2>
                  <div className="card-content">
                    <div className="edit-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="firstname">Prénom</label>
                          <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={editedUser.firstname || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="lastname">Nom</label>
                          <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={editedUser.lastname || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={editedUser.email || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Téléphone</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={editedUser.phone || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="form-group full-width">
                        <label htmlFor="address">Adresse</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={editedUser.address || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          className="btn-cancel" 
                          onClick={toggleEditMode}
                        >
                          <FaTimes /> Annuler
                        </button>
                        <button 
                          className="btn-save" 
                          onClick={saveProfile}
                        >
                          <FaSave /> Enregistrer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="profile-card">
                <h2 className="card-title">Commandes récentes</h2>
                <div className="card-content">
                  {loadingOrders ? (
                    <div className="loading-indicator">Chargement des commandes...</div>
                  ) : recentOrders.length > 0 ? (
                    <div className="recent-orders">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="recent-order-item">
                          <div className="order-info">
                            <h3>Commande #{order.id}</h3>
                            <p className="order-date">
                              {new Date(order.date).toLocaleDateString('fr-FR', {
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="order-details">
                            <span className="order-amount">{order.total.toFixed(2)} €</span>
                            <span className="order-status" data-status={order.status || "livré"}>
                              {order.status || "Livré"}
                            </span>
                          </div>
                        </div>
                      ))}
                      <Link to="/mes-commandes" className="view-all-link">
                        Voir toutes mes commandes <FaHistory />
                      </Link>
                    </div>
                  ) : (
                    <div className="no-orders">
                      <p>Vous n'avez pas encore passé de commande.</p>
                      <Link to="/catalogue" className="btn-primary">
                        Explorer le catalogue
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-tab">
              <div className="profile-header">
                <h1>Historique des commandes</h1>
              </div>
              
              <div className="profile-card">
                <div className="card-content">
                  <div className="orders-summary">
                    <div className="summary-box">
                      <div className="summary-icon">
                        <FaClipboardList />
                      </div>
                      <div className="summary-data">
                        <span className="summary-value">{stats.totalOrders}</span>
                        <span className="summary-label">Commandes totales</span>
                      </div>
                    </div>

                    <div className="summary-box">
                      <div className="summary-icon monetary">
                        <span>€</span>
                      </div>
                      <div className="summary-data">
                        <span className="summary-value">{stats.totalSpent.toFixed(2)} €</span>
                        <span className="summary-label">Montant total dépensé</span>
                      </div>
                    </div>

                    <div className="summary-box">
                      <div className="summary-icon">
                        <FaCalendarAlt />
                      </div>
                      <div className="summary-data">
                        <span className="summary-value">
                          {stats.lastOrder 
                            ? new Date(stats.lastOrder.date).toLocaleDateString('fr-FR') 
                            : "Aucune"}
                        </span>
                        <span className="summary-label">Dernière commande</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/mes-commandes" className="btn-primary btn-block">
                    Voir toutes mes commandes
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="security-tab">
              <div className="profile-header">
                <h1>Sécurité du compte</h1>
              </div>
              
              <div className="profile-card">
                <h2 className="card-title">Mot de passe</h2>
                <div className="card-content">
                  <div className="password-section">
                    <div className="password-info">
                      <div className="security-header">
                        <FaKey className="security-icon" />
                        <div>
                          <h3>Mot de passe</h3>
                          <p>Votre mot de passe a été défini le : <strong>01/01/2023</strong></p>
                        </div>
                      </div>
                      
                      <div className="password-form">
                        <div className="form-group">
                          <label htmlFor="currentPassword">Mot de passe actuel</label>
                          <input 
                            type="password" 
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="newPassword">Nouveau mot de passe</label>
                          <input 
                            type="password" 
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                          <input 
                            type="password" 
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                        
                        {passwordError && (
                          <div className="password-error">
                            <FaExclamationCircle /> {passwordError}
                          </div>
                        )}
                        
                        <button 
                          className="btn-primary" 
                          onClick={changePassword}
                          disabled={
                            changingPassword || 
                            !passwordData.currentPassword || 
                            !passwordData.newPassword || 
                            !passwordData.confirmPassword
                          }
                        >
                          {changingPassword ? 'Changement en cours...' : 'Changer mon mot de passe'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="profile-card">
                <h2 className="card-title">Sessions actives</h2>
                <div className="card-content">
                  <div className="session-item current">
                    <div className="session-icon">
                      <FaShieldAlt />
                    </div>
                    <div className="session-details">
                      <h3>Session actuelle</h3>
                      <p>Navigateur: Chrome</p>
                      <p>Dernière activité: Aujourd'hui, {new Date().toLocaleTimeString('fr-FR')}</p>
                      <p>Adresse IP: 192.168.1.XXX</p>
                    </div>
                    <button className="session-close-btn">
                      Fermer cette session
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="profile-card">
                <h2 className="card-title">Options de sécurité</h2>
                <div className="card-content">
                  <div className="security-option">
                    <div className="option-details">
                      <h3>Notification par email</h3>
                      <p>Recevoir un email lors d'une connexion depuis un nouvel appareil</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={true} readOnly />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="security-option">
                    <div className="option-details">
                      <h3>Authentification à deux facteurs</h3>
                      <p>Ajouter une couche de sécurité supplémentaire à votre compte</p>
                    </div>
                    <button className="btn-outline">
                      Activer
                    </button>
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
