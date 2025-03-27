import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/MedicationDetails.css";
// Import des images de médicaments
import logoImg from "../assets/logo.jpg";
import dolipraneImg from "../assets/Dolipranes.jpg";
import AdvilImg from "../assets/Advil.jpg";
import SpasfonImg from "../assets/Spasfon.png";
import SmectaImg from "../assets/Smeta.jpg";
import GavisconImg from "../assets/Gaviscon.jpg";
import ImodiumImg from "../assets/Imodium.jpg";
import EfferalganImg from "../assets/Efferalgan.png";
import StrepsilsImg from "../assets/Strepsils.jpg";
// Import du composant MedicationCard
import MedicationCard from "../components/MedicationCard";

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
    const fetchMedication = async () => {
      try {
        setLoading(true);
        
        // Base de données simulée des médicaments
        const mockMedications = [
          {
            id: "1",
            name: "Doliprane",
            category: "Antalgique",
            price: 3.99,
            image: dolipraneImg,
            description: "Médicament pour faire baisser la fièvre et soulager les douleurs légères à modérées.",
            dosage: "500mg - 1000mg",
            form: "Comprimés",
            packaging: "Boîte de 16 comprimés",
            practitioner: {
              id: 1,
              name: "Dr. Martin",
              specialty: "Médecine générale"
            },
            indications: "Traitement symptomatique des douleurs d'intensité légère à modérée et/ou des états fébriles.",
            contraindications: "Allergie au paracétamol, insuffisance hépatocellulaire sévère.",
            sideEffects: "Réactions allergiques, troubles hépatiques (rares).",
          },
          {
            id: "2",
            name: "Advil",
            category: "Anti-inflammatoire",
            price: 5.50,
            image: AdvilImg,
            description: "Anti-inflammatoire non stéroïdien pour soulager les douleurs et inflammations.",
            dosage: "200mg - 400mg",
            form: "Comprimés enrobés",
            packaging: "Boîte de 20 comprimés",
            practitioner: {
              id: 2,
              name: "Dr. Dupont",
              specialty: "Rhumatologie"
            },
            indications: "Traitement des douleurs légères à modérées et des états fébriles. Traitement symptomatique des rhumatismes inflammatoires et des arthrites.",
            contraindications: "Allergie à l'ibuprofène, grossesse (à partir du 6ème mois), ulcère gastro-duodénal.",
            sideEffects: "Troubles digestifs, risques hémorragiques, réactions allergiques cutanées.",
          },
          {
            id: "3",
            name: "Spasfon",
            category: "Antispasmodique",
            price: 4.75,
            image: SpasfonImg,
            description: "Médicament utilisé pour le traitement des spasmes et des douleurs abdominales.",
            dosage: "80mg",
            form: "Comprimés pelliculés",
            packaging: "Boîte de 30 comprimés",
            practitioner: {
              id: 3,
              name: "Dr. Bernard",
              specialty: "Gastro-entérologie"
            },
            indications: "Traitement symptomatique des douleurs liées aux troubles fonctionnels du tube digestif et des voies biliaires, des douleurs spasmodiques en gynécologie.",
            contraindications: "Hypersensibilité à la substance active.",
            sideEffects: "Rarement des manifestations allergiques cutanées.",
          },
          {
            id: "4",
            name: "Smecta",
            category: "Gastro-entérologie",
            price: 6.99,
            image: SmectaImg,
            description: "Traitement symptomatique de la diarrhée aiguë et chronique.",
            dosage: "3g par sachet",
            form: "Poudre pour suspension buvable",
            packaging: "Boîte de 30 sachets",
            practitioner: null,
            indications: "Traitement symptomatique de la diarrhée aiguë et chronique. Traitement des douleurs liées aux affections œso-gastro-duodénales et coliques.",
            contraindications: "Hypersensibilité à l'un des composants.",
            sideEffects: "Constipation transitoire, flatulences.",
          },
          {
            id: "5",
            name: "Gaviscon",
            category: "Antiacide",
            price: 7.50,
            image: GavisconImg,
            description: "Médicament contre les remontées acides et les brûlures d'estomac.",
            dosage: "500mg",
            form: "Comprimés à croquer",
            packaging: "Boîte de 48 comprimés",
            practitioner: {
              id: 3,
              name: "Dr. Bernard",
              specialty: "Gastro-entérologie"
            },
            indications: "Traitement symptomatique du reflux gastro-œsophagien et des symptômes tels que brûlures d'estomac, remontées acides.",
            contraindications: "Insuffisance rénale sévère.",
            sideEffects: "Rarement des réactions allergiques, constipation.",
          },
          {
            id: "6",
            name: "Imodium",
            category: "Gastro-entérologie",
            price: 5.75,
            image: ImodiumImg,
            description: "Médicament antidiarrhéique qui ralentit le transit intestinal.",
            dosage: "2mg",
            form: "Gélules",
            packaging: "Boîte de 20 gélules",
            practitioner: {
              id: 3,
              name: "Dr. Bernard",
              specialty: "Gastro-entérologie"
            },
            indications: "Traitement symptomatique des diarrhées aiguës et chroniques.",
            contraindications: "Enfants de moins de 2 ans, colite aiguë, poussées de rectocolite hémorragique, diarrhée invasive avec fièvre.",
            sideEffects: "Constipation secondaire, ballonnements, douleurs abdominales, nausées.",
          },
          {
            id: "7",
            name: "Efferalgan",
            category: "Antalgique",
            price: 4.50,
            image: EfferalganImg,
            description: "Médicament à base de paracétamol pour soulager les douleurs et la fièvre.",
            dosage: "500mg - 1000mg",
            form: "Comprimés effervescents",
            packaging: "Boîte de 16 comprimés",
            practitioner: {
              id: 1,
              name: "Dr. Martin",
              specialty: "Médecine générale"
            },
            indications: "Traitement symptomatique des douleurs d'intensité légère à modérée et/ou des états fébriles.",
            contraindications: "Allergie au paracétamol, insuffisance hépatocellulaire sévère.",
            sideEffects: "Rarement des réactions d'hypersensibilité, troubles hépatiques.",
          },
          {
            id: "8",
            name: "Strepsils",
            category: "ORL",
            price: 6.20,
            image: StrepsilsImg,
            description: "Pastilles pour soulager les maux de gorge et les irritations.",
            dosage: "1.2mg - 0.6mg",
            form: "Pastilles à sucer",
            packaging: "Boîte de 24 pastilles",
            practitioner: {
              id: 4,
              name: "Dr. Rousseau",
              specialty: "ORL"
            },
            indications: "Traitement symptomatique des affections douloureuses de la cavité buccale et de l'oropharynx.",
            contraindications: "Hypersensibilité à l'un des composants.",
            sideEffects: "Rarement des réactions allergiques, nausées.",
          }
        ];

        // Rechercher le médicament spécifique par ID
        const selectedMedication = mockMedications.find(med => med.id === id);
        
        if (selectedMedication) {
          setMedication(selectedMedication);
          
          // Trouver des médicaments similaires (même catégorie)
          const similar = mockMedications
            .filter(med => med.id !== id && med.category === selectedMedication.category)
            .slice(0, 3);
          
          setRelatedMedications(similar);
          setLoading(false);
        } else {
          setError("Médicament non trouvé");
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données du médicament:", err);
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
            <img 
              src={medication.image} 
              alt={medication.name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = logoImg;
              }}
            />
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
                {medication.practitioner ? (
                  <Link to={`/practitioner/${medication.practitioner.id}`} className="detail-meta-value">
                    {medication.practitioner.name}
                  </Link>
                ) : (
                  <span className="detail-meta-value">Information non disponible</span>
                )}
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
            <MedicationCard key={relatedMed.id} medication={relatedMed} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail; 