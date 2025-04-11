import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import "../styles/UserProfile.css";
import authService from "../services/authService"; // Ajoutez cette ligne

const UserProfile = () => {
  const auth = useSelector(state => state.auth);
  const { user } = auth;
  
  // Vérification directe avec authService
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  
  const [activeTab, setActiveTab] = useState("informations");
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const checkAuth = () => {
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);
      
      if (!authStatus) {
        console.log("L'utilisateur n'est pas authentifié, redirection vers login");
      } else {
        console.log("Utilisateur authentifié:", user);
      }
    };
    
    checkAuth();
    
    // Si l'utilisateur est authentifié, charger les données
    if (isAuthenticated && user) {
      setUserInfo({
        firstName: user.firstname || user.firstName || "John",
        lastName: user.lastname || user.lastName || "Doe",
        email: user.email || "john.doe@example.com",
        phone: user.phone || "+33 6 12 34 56 78",
        address: user.address || "123 Rue de la Santé",
        postalCode: user.postalCode || "75014",
        city: user.city || "Paris"
      });

      // Simuler le chargement des commandes (à remplacer par une API réelle)
      setTimeout(() => {
        setOrders([
          {
            id: "CMD-2023-001",
            date: "15/05/2023",
            status: "Livrée",
            total: 78.50,
            items: [
              { id: 1, name: "Doliprane", quantity: 2, price: 3.99 },
              { id: 2, name: "Advil", quantity: 1, price: 5.50 },
              { id: 5, name: "Gaviscon", quantity: 1, price: 7.50 }
            ]
          },
          {
            id: "CMD-2023-002",
            date: "28/06/2023",
            status: "En cours",
            total: 51.25,
            items: [
              { id: 3, name: "Spasfon", quantity: 3, price: 4.75 },
              { id: 6, name: "Imodium", quantity: 2, price: 5.75 },
              { id: 8, name: "Strepsils", quantity: 1, price: 6.20 }
            ]
          }
        ]);
        setLoading(false);
      }, 800);
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    // Ici, vous implémenteriez l'API pour sauvegarder les modifications
    console.log("Enregistrement des modifications:", userInfo);
    
    // Simulation d'une sauvegarde réussie
    setTimeout(() => {
      // Afficher notification de succès
      const notification = document.createElement('div');
      notification.className = 'profile-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
          </svg>
          <span>Modifications sauvegardées avec succès</span>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Animation d'apparition
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
      // Animation de disparition
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
      
      setIsEditing(false);
    }, 600);
  };

  const getInitials = () => {
    return `${userInfo.firstName.charAt(0)}${userInfo.lastName.charAt(0)}`;
  };

  // Formatter un statut de commande avec un badge coloré
  const renderOrderStatus = (status) => {
    let className = "order-status";
    switch (status.toLowerCase()) {
      case "livrée":
        className += " status-delivered";
        break;
      case "en cours":
        className += " status-in-progress";
        break;
      case "annulée":
        className += " status-cancelled";
        break;
      default:
        className += " status-processing";
    }
    
    return <span className={className}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="user-profile-page container">
      <div className="profile-header">
        <div className="profile-user-avatar-container">
          <div className="profile-user-avatar">
            <span>{getInitials()}</span>
          </div>
        </div>
        <div className="profile-user-info">
          <h1>{userInfo.firstName} {userInfo.lastName}</h1>
          <p className="user-email">{userInfo.email}</p>
          <p className="user-member-since">Membre depuis Mai 2023</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === "informations" ? "active" : ""}`}
            onClick={() => setActiveTab("informations")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
            </svg>
            Mes informations
          </button>
          <button 
            className={`profile-tab ${activeTab === "commandes" ? "active" : ""}`}
            onClick={() => setActiveTab("commandes")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
            </svg>
            Mes commandes
          </button>
          <button 
            className={`profile-tab ${activeTab === "prescriptions" ? "active" : ""}`}
            onClick={() => setActiveTab("prescriptions")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3.01 3.9 3.01 5L3 19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM14 15H7V13H14V15ZM7 8H17V6H7V8Z" fill="currentColor"/>
            </svg>
            Mes ordonnances
          </button>
          <button 
            className={`profile-tab ${activeTab === "parametres" ? "active" : ""}`}
            onClick={() => setActiveTab("parametres")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
            </svg>
            Paramètres
          </button>
        </div>

        <div className="profile-tab-content">
          {activeTab === "informations" && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Informations personnelles</h2>
                {!isEditing ? (
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
                    </svg>
                    Modifier
                  </button>
                ) : (
                  <button className="btn-save" onClick={handleSaveChanges}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                    </svg>
                    Enregistrer
                  </button>
                )}
              </div>

              <div className="profile-info-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="firstName" 
                        value={userInfo.firstName} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{userInfo.firstName}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="lastName" 
                        value={userInfo.lastName} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{userInfo.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        name="email" 
                        value={userInfo.email} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{userInfo.email}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    {isEditing ? (
                      <input 
                        type="tel" 
                        name="phone" 
                        value={userInfo.phone} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{userInfo.phone}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Adresse</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="address" 
                        value={userInfo.address} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{userInfo.address}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Code postal</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="postalCode" 
                        value={userInfo.postalCode} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{userInfo.postalCode}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Ville</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="city" 
                        value={userInfo.city} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{userInfo.city}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                {isEditing && (
                  <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                    Annuler
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "commandes" && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Historique de commandes</h2>
              </div>

              {orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div className="order-card" key={order.id}>
                      <div className="order-header">
                        <div className="order-id-date">
                          <span className="order-id">{order.id}</span>
                          <span className="order-date">Commandée le {order.date}</span>
                        </div>
                        <div className="order-status-total">
                          {renderOrderStatus(order.status)}
                          <span className="order-total">{order.total.toFixed(2)} €</span>
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.items.map((item) => (
                          <div className="order-item" key={item.id}>
                            <div className="item-name-qty">
                              <span className="item-name">{item.name}</span>
                              <span className="item-qty">x{item.quantity}</span>
                            </div>
                            <span className="item-price">{(item.price * item.quantity).toFixed(2)} €</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-actions">
                        <Link to={`/commandes/${order.id}`} className="btn-view-order">
                          Voir les détails
                        </Link>
                        {order.status.toLowerCase() === "en cours" && (
                          <button className="btn-track-order">
                            Suivre la commande
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5H5C3.89 5 3 5.9 3 7V17C3 18.1 3.89 19 5 19H19C20.11 19 21 18.1 21 17V7C21 5.9 20.11 5 19 5ZM19 17H5V7H19V17ZM17 10H7V8H17V10ZM13 14H7V12H13V14Z" fill="#B0BEC5"/>
                  </svg>
                  <h3>Aucune commande</h3>
                  <p>Vous n'avez pas encore passé de commande.</p>
                  <Link to="/catalogue" className="btn-shop-now">
                    Parcourir le catalogue
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Mes ordonnances</h2>
                <button className="btn-add-prescription">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
                  </svg>
                  Ajouter une ordonnance
                </button>
              </div>

              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM9 13H15V15H9V13ZM9 16H15V18H9V16ZM9 10H11V12H9V10Z" fill="#B0BEC5"/>
                </svg>
                <h3>Aucune ordonnance</h3>
                <p>Vous n'avez pas encore ajouté d'ordonnance.</p>
                <button className="btn-upload-prescription">
                  Télécharger une ordonnance
                </button>
              </div>
            </div>
          )}

          {activeTab === "parametres" && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Paramètres du compte</h2>
              </div>

              <div className="settings-section">
                <h3>Sécurité</h3>
                <div className="settings-option">
                  <div className="option-info">
                    <h4>Modifier le mot de passe</h4>
                    <p>Changer votre mot de passe pour sécuriser votre compte</p>
                  </div>
                  <button className="btn-change-password">
                    Modifier
                  </button>
                </div>
                
                <div className="settings-option">
                  <div className="option-info">
                    <h4>Authentification à deux facteurs</h4>
                    <p>Ajouter une couche supplémentaire de sécurité à votre compte</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Préférences</h3>
                <div className="settings-option">
                  <div className="option-info">
                    <h4>Notifications par email</h4>
                    <p>Recevoir des emails concernant vos commandes et mises à jour</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked readOnly />
                    <span className="slider round"></span>
                  </label>
                </div>
                
                <div className="settings-option">
                  <div className="option-info">
                    <h4>Newsletters</h4>
                    <p>Recevoir nos newsletters sur les nouveaux produits et promotions</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" readOnly />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="danger-zone">
                <h3>Zone de danger</h3>
                <div className="settings-option">
                  <div className="option-info danger">
                    <h4>Supprimer mon compte</h4>
                    <p>Cette action est irréversible et supprimera toutes vos données</p>
                  </div>
                  <button className="btn-delete-account">
                    Supprimer
                  </button>
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