import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MedicationCatalog.css";

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
    // Simulation d'une requête API
    const fetchMedications = async () => {
      try {
        setLoading(true);
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données de test
        const mockMedications = [
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
          },
          {
            id: 4,
            name: "Rythmocard",
            category: "Cardiologie",
            price: 52.99,
            image: "/placeholder-medication.jpg",
            description: "Traitement des troubles du rythme cardiaque."
          },
          {
            id: 5,
            name: "Antibiofort",
            category: "Antibiotique",
            price: 18.50,
            image: "/placeholder-medication.jpg",
            description: "Antibiotique à large spectre pour traiter diverses infections bactériennes."
          },
          {
            id: 6,
            name: "Neuralgex",
            category: "Neurologie",
            price: 39.75,
            image: "/placeholder-medication.jpg",
            description: "Traitement des douleurs neurologiques et neuropathiques."
          }
        ];
        
        setMedications(mockMedications);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des médicaments");
        setLoading(false);
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
                <img src={medication.image} alt={medication.name} />
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