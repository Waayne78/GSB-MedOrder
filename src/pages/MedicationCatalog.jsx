import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/MedicationCatalog.css";
// Import de l'image disponible pour les placeholders
import logoImg from "../assets/logo.jpg";
import dolipraneImg from "../assets/Dolipranes.jpg";
import AdvilImg from "../assets/Advil.jpg";
import SpasfonImg from "../assets/Spasfon.png";
import SmectaImg from "../assets/Smeta.jpg";
import GavisconImg from "../assets/Gaviscon.jpg";
import ImodiumImg from "../assets/Imodium.jpg";
import EfferalganImg from "../assets/Efferalgan.png";
import StrepsilsImg from "../assets/Strepsils.jpg";
import { medicationService } from "../services/api";
import cartService from '../services/cartService';
import authService from '../services/authService';

// Définir l'URL de base pour les images
const IMAGE_BASE_URL = 'http://localhost:3000/images/';

const MedicationCatalog = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "name",
    sortOrder: "asc"
  });
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {
    console.log("Chargement des médicaments depuis l'API...");
    const fetchMedications = async () => {
      try {
        setLoading(true);
        const response = await medicationService.getAllMedications();
        
        // Transformation des données pour s'assurer que les prix sont des nombres
        const formattedMedications = response.data.map(med => ({
          ...med,
          price: parseFloat(med.price) // Conversion en nombre
        }));
        
        console.log("Médicaments chargés depuis l'API:", formattedMedications);
        setMedications(formattedMedications);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des médicaments");
        setLoading(false);
        console.error("Erreur lors du chargement des médicaments:", err);
      }
    };

    fetchMedications();
  }, []);

  // Filtrer et trier les médicaments
  const filterAndSortMedications = () => {
    let filtered = [...medications];
    
    // Filtrage par recherche
    if (searchQuery) {
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtrage par catégorie
    if (filters.category) {
      filtered = filtered.filter(med => med.category === filters.category);
    }
    
    // Filtrage par prix
    if (filters.minPrice) {
      filtered = filtered.filter(med => med.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(med => med.price <= parseFloat(filters.maxPrice));
    }
    
    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (filters.sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (filters.sortBy === "price") {
        comparison = a.price - b.price;
      }
      
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "name",
      sortOrder: "asc"
    });
  };

  const handleAddToCart = (medication, event) => {
    // Vérifier si l'utilisateur est connecté
    if (!authService.isAuthenticated()) {
      // Afficher le message élégant au lieu de rediriger
      setShowLoginMessage(true);
      
      // Cacher le message après 3 secondes
      setTimeout(() => {
        setShowLoginMessage(false);
      }, 3000);
      return;
    }

    try {
      // Créer une copie du médicament avec la quantité 1 par défaut
      const itemToAdd = {
        id: medication.id,
        name: medication.name,
        price: medication.price,
        category: medication.category,
        image: medication.image,
        quantity: 1
      };

      // Ajouter au panier via le service
      cartService.addToCart(itemToAdd);

      // Animation du bouton
      const button = event.currentTarget;
      button.classList.add('pulse-animation');
      setTimeout(() => {
        button.classList.remove('pulse-animation');
      }, 800);

      // Créer et afficher une notification de succès
      const notification = document.createElement('div');
      notification.className = 'notification notification-success';
      notification.innerHTML = `
        <div class="notification-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>${medication.name} ajouté au panier</span>
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
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      
      // Notification d'erreur
      const notification = document.createElement('div');
      notification.className = 'notification notification-error';
      notification.innerHTML = `
        <div class="notification-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12" y2="16"></line>
          </svg>
          <span>Erreur lors de l'ajout au panier</span>
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
    }
  };

  const filteredMedications = filterAndSortMedications();
  const categories = [...new Set(medications.map(med => med.category))];

  if (loading) {
    return (
      <div className="catalog-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du catalogue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-error">
        <h2>Une erreur s'est produite</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="medication-catalog container">
      <h1>Catalogue de médicaments</h1>
      
      {console.log("Medications:", medications)}
      
      <div className="catalog-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher un médicament..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category">Catégorie</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="minPrice">Prix min</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="maxPrice">Prix max</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortBy">Trier par</label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="name">Nom</option>
              <option value="price">Prix</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortOrder">Ordre</label>
            <select
              id="sortOrder"
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
            >
              <option value="asc">Croissant</option>
              <option value="desc">Décroissant</option>
            </select>
          </div>
          
          <button className="btn btn-outline" onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
      </div>
      
      {filteredMedications.length === 0 ? (
        <div className="no-results">
          <h2>Aucun résultat trouvé</h2>
          <p>Essayez de modifier vos critères de recherche.</p>
        </div>
      ) : (
        <div className="medications-grid">
          {filteredMedications.map(medication => (
            <div className="medication-card" key={medication.id}>
              <div className="medication-image">
                <img 
                  src={medication.image ? `${IMAGE_BASE_URL}${medication.image}` : logoImg} 
                  alt={medication.name} 
                  onError={(e) => {
                    console.log(`Erreur de chargement d'image pour: ${medication.name}`);
                    e.target.onerror = null;
                    e.target.src = logoImg;
                  }}
                />
                <span className="medication-category">{medication.category}</span>
              </div>
              <div className="medication-info">
                <h3 className="medication-name">{medication.name}</h3>
                <p className="medication-price">
                  {(() => {
                    try {
                      return parseFloat(medication.price).toFixed(2);
                    } catch (e) {
                      return 'Prix non disponible';
                    }
                  })()} €
                </p>
                <p className="medication-description">{medication.description}</p>
                <div className="medication-actions">
                  <button 
                    className="details-btn"
                    onClick={() => navigate(`/medication/${medication.id}`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                    Détails
                  </button>
                  
                  <button 
                    className="add-to-cart-btn"
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
            </div>
          ))}
        </div>
      )}
      
      {/* Message élégant pour la connexion */}
      {showLoginMessage && (
        <div className="login-message">
          <div className="login-message-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
            <div>
              <h3>Connexion requise</h3>
              <p>Veuillez vous connecter pour ajouter des articles à votre panier.</p>
              <div className="login-buttons">
                <a href="/login" className="btn-login">Se connecter</a>
                <a href="/register" className="btn-register">S'inscrire</a>
              </div>
            </div>
            <button className="close-message" onClick={() => setShowLoginMessage(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationCatalog;