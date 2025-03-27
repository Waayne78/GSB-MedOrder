import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

const MedicationCatalog = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "name",
    sortOrder: "asc"
  });

  useEffect(() => {
    console.log("Chargement des médicaments...");
    // Simulation d'une requête API
    const fetchMedications = async () => {
      try {
        setLoading(true);
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données de test avec des médicaments connus
        const mockMedications = [
          {
            id: 1,
            name: "Doliprane",
            category: "Antalgique",
            price: 3.99,
            image: dolipraneImg,
            description: "Médicament pour faire baisser la fièvre et soulager les douleurs légères à modérées.",
            practitioner: {
              id: 1,
              name: "Dr. Martin",
              specialty: "Médecine générale"
            }
          },
          {
            id: 2,
            name: "Advil",
            category: "Anti-inflammatoire",
            price: 5.50,
            image: AdvilImg,
            description: "Anti-inflammatoire non stéroïdien pour soulager les douleurs et inflammations.",
            practitioner: {
              id: 2,
              name: "Dr. Dupont",
              specialty: "Rhumatologie"
            }
          },
          {
            id: 3,
            name: "Spasfon",
            category: "Antispasmodique",
            price: 4.75,
            image: SpasfonImg,
            description: "Médicament utilisé pour le traitement des spasmes et des douleurs abdominales.",
            practitioner: {
              id: 3,
              name: "Dr. Bernard",
              specialty: "Gastro-entérologie"
            }
          },
          {
            id: 4,
            name: "Smecta",
            category: "Gastro-entérologie",
            price: 6.99,
            image: SmectaImg,
            description: "Traitement symptomatique de la diarrhée aiguë et chronique.",
            practitioner: null // Exemple d'un médicament sans praticien associé
          },
          {
            id: 5,
            name: "Gaviscon",
            category: "Antiacide",
            price: 7.50,
            image: GavisconImg,
            description: "Médicament contre les remontées acides et les brûlures d'estomac.",
            practitioner: {
              id: 3,
              name: "Dr. Bernard",
              specialty: "Gastro-entérologie"
            }
          },
          {
            id: 6,
            name: "Imodium",
            category: "Gastro-entérologie",
            price: 5.75,
            image: ImodiumImg,
            description: "Médicament antidiarrhéique qui ralentit le transit intestinal.",
            practitioner: {
              id: 3,
              name: "Dr. Bernard",
              specialty: "Gastro-entérologie"
            }
          },
          {
            id: 7,
            name: "Efferalgan",
            category: "Antalgique",
            price: 4.50,
            image: EfferalganImg,
            description: "Médicament à base de paracétamol pour soulager les douleurs et la fièvre.",
            practitioner: {
              id: 1,
              name: "Dr. Martin",
              specialty: "Médecine générale"
            }
          },
          {
            id: 8,
            name: "Strepsils",
            category: "ORL",
            price: 6.20,
            image: StrepsilsImg,
            description: "Pastilles pour soulager les maux de gorge et les irritations.",
            practitioner: {
              id: 4,
              name: "Dr. Rousseau",
              specialty: "ORL"
            }
          }
        ];
        
        console.log("Médicaments chargés:", mockMedications);
        setMedications(mockMedications);
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
                  src={medication.image} 
                  alt={medication.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = logoImg;
                  }}
                />
                <span className="medication-category">{medication.category}</span>
              </div>
              <div className="medication-info">
                <h3 className="medication-name">{medication.name}</h3>
                <p className="medication-price">{medication.price.toFixed(2)} €</p>
                <p className="medication-description">{medication.description}</p>
                <div className="medication-actions">
                  <Link to={`/medication/${medication.id}`} className="btn-details">
                    Détails
                  </Link>
                  <button className="btn-add-to-cart">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 9H13V6H16V4H13V1H11V4H8V6H11V9ZM7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18ZM7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L21.16 4.96L19.42 4H19.41L18.31 6L15.55 11H8.53L8.4 10.73L6.16 6L5.21 4L4.27 2H1V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.29 15 7.17 14.89 7.17 14.75Z" fill="currentColor"/>
                    </svg>
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationCatalog;