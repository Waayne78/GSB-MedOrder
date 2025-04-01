import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/PractitionerProfile.css";
import authService from "../services/authService";
import cartService from "../services/cartService";
import gsbLogo from "../assets/logo.jpg";
import MedicationCard from "../components/MedicationCard";

// Base de données des images de médicaments
const medicationImages = {
  "Doliprane": "/images/doliprane.jpg",
  "Efferalgan": "/images/efferalgan.jpg",
  "Advil": "/images/advil.jpg",
  "Spasfon": "/images/spasfon.jpg",
  "Gaviscon": "/images/gaviscon.jpg",
  "Imodium": "/images/imodium.jpg",
  "Strepsils": "/images/strepsils.jpg",
  "Smecta": "/images/smecta.jpg"
};

// Chemin vers le logo GSB pour l'utiliser comme fallback
const GSB_LOGO_PATH = "/src/assets/logo.jpg";

// Fonction pour obtenir l'image correcte du médicament
const getMedicationImage = (medication) => {
  if (!medication || !medication.name) {
    return gsbLogo;
  }
  
  // Essayer d'abord le chemin standard des médicaments
  return `/src/assets/medications/${medication.name.toLowerCase()}.jpg`;
};

// Fonction qui sélectionne un avatar local basé sur l'ID
const getLocalAvatar = (id) => {
  // Convertir l'ID en nombre et utiliser le modulo pour choisir parmi 6 avatars
  const avatarIndex = (parseInt(id) % 6) + 1;
  return `/assets/avatars/doctor${avatarIndex}.png`;
};

// Créez une base de données de praticiens pour la simulation
const mockPractitioners = {
  "1": {
    id: "1",
    name: "Dr. Martin",
    title: "Médecin Généraliste",
    specialty: "Médecine générale",
    avatarInitials: "DM",
    description: "Le Dr. Martin est un médecin généraliste avec plus de 10 ans d'expérience. Spécialiste des maladies courantes, il a effectué ses études à la faculté de médecine de Lyon.",
    location: "Lyon, France",
    email: "martin@gsb.fr",
    phone: "+33 1 23 45 67 89",
    experience: "10 ans",
    education: "Faculté de Médecine de Lyon",
    medications: [
      {
        id: "1",
        name: "Doliprane",
        category: "Antalgique",
        price: 3.99,
        image: "/placeholder-medication.jpg",
        description: "Médicament pour faire baisser la fièvre et soulager les douleurs légères à modérées."
      },
      {
        id: "7",
        name: "Efferalgan",
        category: "Antalgique",
        price: 4.50,
        image: "/placeholder-medication.jpg",
        description: "Médicament à base de paracétamol pour soulager les douleurs et la fièvre."
      }
    ]
  },
  "2": {
    id: "2",
    name: "Dr. Dupont",
    title: "Rhumatologue",
    specialty: "Rhumatologie",
    avatarInitials: "DD",
    description: "Le Dr. Dupont est un rhumatologue spécialisé dans le traitement des maladies articulaires et musculaires. Il a plus de 15 ans d'expérience dans le domaine.",
    location: "Marseille, France",
    email: "dupont@gsb.fr",
    phone: "+33 4 91 23 45 67",
    experience: "15 ans",
    education: "Faculté de Médecine de Marseille",
    medications: [
      {
        id: "2",
        name: "Advil",
        category: "Anti-inflammatoire",
        price: 5.50,
        image: "/placeholder-medication.jpg",
        description: "Anti-inflammatoire non stéroïdien pour soulager les douleurs et inflammations."
      }
    ]
  },
  "3": {
    id: "3",
    name: "Dr. Bernard",
    title: "Gastro-entérologue",
    specialty: "Gastro-entérologie",
    avatarInitials: "DB",
    description: "Le Dr. Bernard est un gastro-entérologue renommé avec plus de 20 ans d'expérience. Il est spécialisé dans le diagnostic et le traitement des maladies du système digestif.",
    location: "Paris, France",
    email: "bernard@gsb.fr",
    phone: "+33 1 45 67 89 10",
    experience: "20 ans",
    education: "Faculté de Médecine de Paris",
    medications: [
      {
        id: "3",
        name: "Spasfon",
        category: "Antispasmodique",
        price: 4.75,
        image: "/placeholder-medication.jpg",
        description: "Médicament utilisé pour le traitement des spasmes et des douleurs abdominales."
      },
      {
        id: "5",
        name: "Gaviscon",
        category: "Antiacide",
        price: 7.50,
        image: "/placeholder-medication.jpg",
        description: "Médicament contre les remontées acides et les brûlures d'estomac."
      },
      {
        id: "6",
        name: "Imodium",
        category: "Gastro-entérologie",
        price: 5.75,
        image: "/placeholder-medication.jpg",
        description: "Médicament antidiarrhéique qui ralentit le transit intestinal."
      }
    ]
  },
  "4": {
    id: "4",
    name: "Dr. Rousseau",
    title: "Oto-rhino-laryngologiste",
    specialty: "ORL",
    avatarInitials: "DR",
    description: "Le Dr. Rousseau est un spécialiste ORL avec 12 ans d'expérience. Il traite les pathologies de l'oreille, du nez et de la gorge.",
    location: "Lille, France",
    email: "rousseau@gsb.fr",
    phone: "+33 3 20 45 67 89",
    experience: "12 ans",
    education: "Faculté de Médecine de Lille",
    medications: [
      {
        id: "8",
        name: "Strepsils",
        category: "ORL",
        price: 6.20,
        image: "/placeholder-medication.jpg",
        description: "Pastilles pour soulager les maux de gorge et les irritations."
      }
    ]
  }
};

const PractitionerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [practitioner, setPractitioner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDefaultImage, setUseDefaultImage] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    // Simulation d'une requête API
    const fetchPractitioner = async () => {
      try {
        setLoading(true);
        
        // Utiliser les données simulées du praticien correspondant à l'ID
        setTimeout(() => {
          // Vérifier si le praticien existe dans notre base de données simulée
          if (mockPractitioners[id]) {
            setPractitioner(mockPractitioners[id]);
          } else {
            // Fallback sur Jean Dubois si l'ID n'existe pas (pour la compatibilité)
            setPractitioner({
              id: id,
              name: "Dr. Jean Dubois",
              title: "Médecin Généraliste",
              specialty: "Cardiologie",
              avatarInitials: "JD",
              description: "Le Dr. Jean Dubois est un cardiologue expérimenté avec plus de 15 ans de pratique. Spécialiste des maladies cardiovasculaires, il a effectué ses études à la faculté de médecine de Paris et a complété sa spécialisation à l'Hôpital Européen Georges-Pompidou. Il est membre de la Société Française de Cardiologie.",
              location: "Paris, France",
              email: "jean.dubois@gsb.fr",
              phone: "+33 1 23 45 67 89",
              experience: "15 ans",
              education: "Faculté de Médecine de Paris",
              medications: [
                {
                  id: 1,
                  name: "Cardiolex",
                  category: "Cardiologie",
                  price: 45.99,
                  image: "/placeholder-medication.jpg",
                  description: "Médicament pour le traitement des maladies cardiovasculaires."
                },
                {
                  id: 2,
                  name: "Tensiostat",
                  category: "Cardiologie",
                  price: 32.5,
                  image: "/placeholder-medication.jpg",
                  description: "Traitement contre l'hypertension artérielle."
                },
                {
                  id: 3,
                  name: "Vasodil",
                  category: "Cardiologie",
                  price: 28.75,
                  image: "/placeholder-medication.jpg",
                  description: "Médicament vasodilatateur pour améliorer la circulation sanguine."
                }
              ]
            });
          }
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Erreur lors du chargement des données du praticien");
        setLoading(false);
      }
    };

    fetchPractitioner();
  }, [id]);

  // Fonction pour afficher des notifications
  const showNotification = ({ type, title, message }) => {
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
      <div class="cart-notification-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${type === 'success' 
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
            : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line>'
          }
        </svg>
        <div class="cart-notification-text">
          <div class="cart-notification-title">${title}</div>
          <div class="cart-notification-detail">${message}</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  // Fonction pour ajouter au panier
  const handleAddToCart = (medication, event) => {
    // Vérifier si l'utilisateur est connecté
    if (!authService.isAuthenticated()) {
      setShowLoginDialog(true);
      return;
    }

    try {
      // Créer une copie du médicament avec la quantité 1 par défaut
      const itemToAdd = {
        id: medication.id,
        name: medication.name,
        price: medication.price,
        category: medication.category,
        image: getMedicationImage(medication), // Utiliser l'image correcte
        quantity: 1
      };

      // Animation du bouton
      const button = event.currentTarget;
      button.classList.add('success-animation');
      
      // Ajouter au panier via le service
      cartService.addToCart(itemToAdd);

      // Afficher une notification de succès
      showNotification({
        type: 'success',
        title: 'Produit ajouté au panier',
        message: `${medication.name} ajouté au panier`
      });
      
      // Retirer l'animation après un délai
      setTimeout(() => {
        button.classList.remove('success-animation');
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      
      // Notification d'erreur
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: "Impossible d'ajouter au panier"
      });
    }
  };

  // Fonction de gestion des erreurs d'image
  const handleImageError = (e) => {
    e.target.onerror = null; // Éviter les boucles infinies
    e.target.src = gsbLogo; // Utiliser l'import direct
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des informations du praticien...</p>
      </div>
    );
  }

  if (error || !practitioner) {
    return (
      <div className="error-container">
        <h2>Une erreur s'est produite</h2>
        <p>{error || "Impossible de trouver ce praticien"}</p>
        <button className="btn btn-primary" onClick={() => window.history.back()}>
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="practitioner-profile container">
      {/* Dialogue de connexion requis */}
      {showLoginDialog && (
        <div className="login-dialog-overlay" onClick={() => setShowLoginDialog(false)}>
          <div className="login-dialog" onClick={e => e.stopPropagation()}>
            <button className="close-dialog" onClick={() => setShowLoginDialog(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="dialog-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </div>
            
            <div className="dialog-content">
              <h3>Connexion requise</h3>
              <p>Veuillez vous connecter pour ajouter des articles à votre panier.</p>
            </div>
            
            <div className="dialog-actions">
              <button className="btn-login" onClick={() => navigate('/login')}>
                Se connecter
              </button>
              <button className="btn-register" onClick={() => navigate('/register')}>
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="profile-header">
        <div className="profile-avatar-container">
          <div 
            className="profile-avatar" 
            style={{ 
              backgroundColor: getAvatarColor(practitioner.id),
              backgroundImage: `linear-gradient(135deg, ${getAvatarColor(practitioner.id)}, ${getDarkerColor(practitioner.id)})`
            }}
          >
            <span className="avatar-initials">{practitioner.avatarInitials}</span>
          </div>
        </div>
        
        <div className="profile-info">
          <h1 className="profile-name">{practitioner.name}</h1>
          <p className="profile-title">{practitioner.title}</p>
          <span className="profile-specialty">{practitioner.specialty}</span>
          
          <div className="profile-meta">
            <div className="profile-meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
              </svg>
              <span>{practitioner.location}</span>
            </div>
            <div className="profile-meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
              </svg>
              <span>{practitioner.email}</span>
            </div>
            <div className="profile-meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
              </svg>
              <span>{practitioner.phone}</span>
            </div>
            <div className="profile-meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
              </svg>
              <span>Expérience: {practitioner.experience}</span>
            </div>
          </div>
          
          <p className="profile-description">{practitioner.description}</p>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-section">
            <h2 className="profile-section-title">Médicaments proposés</h2>
            <div className="profile-medications">
              {practitioner.medications.map(medication => (
                <div key={medication.id} className="medication-card">
                  <div className="medication-image">
                    <img 
                      src={getMedicationImage(medication)} 
                      alt={medication.name} 
                      onError={handleImageError}
                    />
                    <div className={`medication-category ${medication.category.toLowerCase()}`}>
                      {medication.category}
                    </div>
                  </div>
                  <div className="medication-info">
                    <h3>{medication.name}</h3>
                    <p className="medication-price">{medication.price.toFixed(2)} €</p>
                    <p className="medication-description">
                      {medication.description && medication.description.length > 100 
                        ? `${medication.description.substring(0, 100)}...` 
                        : medication.description}
                    </p>
                  </div>
                  <div className="medication-actions">
                    <button 
                      className="details-btn"
                      onClick={() => navigate(`/medication/${medication.id}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      Détails
                    </button>
                    
                    <button 
                      className="add-to-cart-button compact"
                      onClick={(event) => handleAddToCart(medication, event)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Ajouter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="profile-section">
            <h2 className="profile-section-title">Formation et parcours</h2>
            <p>
              <strong>Formation :</strong> {practitioner.education}
            </p>
            <p>
              <strong>Expérience :</strong> {practitioner.experience}
            </p>
            <p>
              <strong>Spécialité :</strong> {practitioner.specialty}
            </p>
          </div>
        </div>
        
        <div className="profile-sidebar">
          <div className="profile-section profile-contact-form">
            <h2 className="profile-section-title">Contacter le praticien</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nom</label>
                <input type="text" id="name" placeholder="Votre nom" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Votre email" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Votre message"></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour obtenir une couleur d'avatar en fonction de l'ID du praticien
function getAvatarColor(id) {
  const colors = {
    "1": "#2196F3", // Bleu pour Dr. Martin
    "2": "#4CAF50", // Vert pour Dr. Dupont
    "3": "#9C27B0", // Violet pour Dr. Bernard
    "4": "#FF9800", // Orange pour Dr. Rousseau
    default: "#0088cc" // Bleu par défaut
  };
  
  return colors[id] || colors.default;
}

// Fonction pour obtenir une version plus foncée de la couleur pour le dégradé
function getDarkerColor(id) {
  const colors = {
    "1": "#1976D2", // Bleu foncé pour Dr. Martin
    "2": "#388E3C", // Vert foncé pour Dr. Dupont
    "3": "#7B1FA2", // Violet foncé pour Dr. Bernard
    "4": "#F57C00", // Orange foncé pour Dr. Rousseau
    default: "#0077bb" // Bleu foncé par défaut
  };
  
  return colors[id] || colors.default;
}

export default PractitionerProfile;