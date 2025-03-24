import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/MedicationDetails.css";

const MedicationDetail = () => {
  const { id } = useParams();
  const [medication, setMedication] = useState(null);
  const [relatedMedications, setRelatedMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Simulation d'une requête API - à remplacer par un vrai appel API
    const fetchMedication = async () => {
      try {
        setLoading(true);
        // Simulation de données pour le développement
        setTimeout(() => {
          setMedication({
            id: id,
            name: "Cardiolex",
            category: "Cardiologie",
            price: 45.99,
            image: "/placeholder-medication.jpg",
            description: "Cardiolex est un médicament innovant pour le traitement des maladies cardiovasculaires. Il est efficace pour réduire l'hypertension artérielle et améliorer la fonction cardiaque.",
            dosage: "50mg - 100mg",
            form: "Comprimés",
            packaging: "Boîte de 30 comprimés",
            practitioner: {
              id: 1,
              name: "Dr. Jean Dubois",
              specialty: "Cardiologie"
            },
            indications: "Hypertension artérielle, insuffisance cardiaque, arythmie",
            contraindications: "Allergie aux principes actifs, grossesse, allaitement",
            sideEffects: "Maux de tête, fatigue, vertiges (rares)",
          });
          
          setRelatedMedications([
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
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Erreur lors du chargement des données du médicament");
        setLoading(false);
      }
    };

    fetchMedication();
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (medication) {
      // Remplacer par votre action d'ajout au panier
      alert(`${quantity} ${medication.name} ajouté(s) au panier`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des informations du médicament...</p>
      </div>
    );
  }

  if (error || !medication) {
    return (
      <div className="error-container">
        <h2>Une erreur s'est produite</h2>
        <p>{error || "Impossible de trouver ce médicament"}</p>
        <button className="btn btn-primary" onClick={() => window.history.back()}>
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="medication-detail container">
      <div className="detail-container">
        <div className="detail-grid">
          <div className="detail-image">
            <img src={medication.image} alt={medication.name} />
          </div>
          <div className="detail-content">
            <span className="detail-category">{medication.category}</span>
            <h1 className="detail-name">{medication.name}</h1>
            <div className="detail-price">{medication.price.toFixed(2)} €</div>
            
            <p className="detail-description">
              {medication.description}
            </p>
            
            <div className="detail-meta">
              <div className="detail-meta-item">
                <span className="detail-meta-label">Dosage</span>
                <span className="detail-meta-value">{medication.dosage}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Forme</span>
                <span className="detail-meta-value">{medication.form}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Conditionnement</span>
                <span className="detail-meta-value">{medication.packaging}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Praticien</span>
                <Link to={`/practitioner/${medication.practitioner.id}`} className="detail-meta-value">
                  {medication.practitioner.name}
                </Link>
              </div>
            </div>
            
            <div className="detail-actions">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn minus" 
                  onClick={handleDecreaseQuantity}
                  aria-label="Diminuer la quantité"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                  min="1"
                />
                <button 
                  className="quantity-btn plus" 
                  onClick={handleIncreaseQuantity}
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
              
              <button 
                className="btn-add-to-cart-large" 
                onClick={handleAddToCart}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 9H13V6H16V4H13V1H11V4H8V6H11V9ZM7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18ZM7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L21.16 4.96L19.42 4H19.41L18.31 6L15.55 11H8.53L8.4 10.73L6.16 6L5.21 4L4.27 2H1V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.29 15 7.17 14.89 7.17 14.75Z" fill="currentColor"/>
                </svg>
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="medication-tabs">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button 
            className={`tab-button ${activeTab === "indications" ? "active" : ""}`}
            onClick={() => setActiveTab("indications")}
          >
            Indications
          </button>
          <button 
            className={`tab-button ${activeTab === "contraindications" ? "active" : ""}`}
            onClick={() => setActiveTab("contraindications")}
          >
            Contre-indications
          </button>
          <button 
            className={`tab-button ${activeTab === "sideEffects" ? "active" : ""}`}
            onClick={() => setActiveTab("sideEffects")}
          >
            Effets secondaires
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === "description" && (
            <div>
              <h3>Description détaillée</h3>
              <p>{medication.description}</p>
            </div>
          )}
          
          {activeTab === "indications" && (
            <div>
              <h3>Indications thérapeutiques</h3>
              <p>{medication.indications}</p>
            </div>
          )}
          
          {activeTab === "contraindications" && (
            <div>
              <h3>Contre-indications</h3>
              <p>{medication.contraindications}</p>
            </div>
          )}
          
          {activeTab === "sideEffects" && (
            <div>
              <h3>Effets secondaires</h3>
              <p>{medication.sideEffects}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="medication-related">
        <h2 className="related-title">Médicaments similaires</h2>
        <div className="related-grid">
          {relatedMedications.map(relatedMed => (
            <div className="medication-card" key={relatedMed.id}>
              <div className="medication-image">
                <img src={relatedMed.image} alt={relatedMed.name} />
                <span className="medication-category">{relatedMed.category}</span>
              </div>
              <div className="medication-info">
                <h3 className="medication-name">{relatedMed.name}</h3>
                <p className="medication-price">{relatedMed.price.toFixed(2)} €</p>
                <p className="medication-description">{relatedMed.description}</p>
                <div className="medication-actions">
                  <Link to={`/medication/${relatedMed.id}`} className="btn-details">
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail; 