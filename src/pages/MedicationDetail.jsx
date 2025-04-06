import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/MedicationDetails.css";
import logoImg from "../assets/logo.jpg";
import dolipraneImg from "../assets/Dolipranes.jpg";
import AdvilImg from "../assets/Advil.jpg";
import SpasfonImg from "../assets/Spasfon.png";
import SmectaImg from "../assets/Smeta.jpg";
import GavisconImg from "../assets/Gaviscon.jpg";
import ImodiumImg from "../assets/Imodium.jpg";
import EfferalganImg from "../assets/Efferalgan.png";
import StrepsilsImg from "../assets/Strepsils.jpg";
import MedicationCard from "../components/MedicationCard";
import cartService from "../services/cartService";
import authService from "../services/authService";

const IMAGE_BASE_URL = "http://localhost:3006/images/";

const MedicationDetail = () => {
  const { id } = useParams();
  const [medication, setMedication] = useState(null);
  const [relatedMedications, setRelatedMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Chargement des médicaments depuis l'API...");
    const fetchMedications = async () => {
      try {
        setLoading(true);
        const response = await medicationService.getAllMedications();
        const medicationData = response.data.find(
          (med) => med.id === parseInt(id)
        );
        setMedication(medicationData);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des médicaments");
        setLoading(false);
        console.error("Erreur:", err);
      }
    };

    fetchMedications();
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

  const handleAddToCart = (event) => {
    // Vérifier si l'utilisateur est connecté
    if (!authService.isAuthenticated()) {
      // Afficher le message de connexion requise
      setShowLoginMessage(true);
      return;
    }

    try {
      if (!medication) return;

      const itemToAdd = {
        id: medication.id,
        name: medication.name,
        price: medication.price,
        category: medication.category,
        image: medication.image,
        quantity: quantity,
      };

      const button = event.currentTarget;
      button.classList.add("success-animation");

      cartService.addToCart(itemToAdd);

      const notification = document.createElement("div");
      notification.className = "medication-notification success";
      notification.innerHTML = `
        <div class="medication-notification-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div class="medication-notification-text">
            <div class="medication-notification-title">Produit ajouté au panier</div>
            <div class="medication-notification-detail">${medication.name} (Quantité: ${quantity})</div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add("show");
      }, 10);

      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);

      setTimeout(() => {
        button.classList.remove("success-animation");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);

      const notification = document.createElement("div");
      notification.className = "medication-notification error";
      notification.innerHTML = `
        <div class="medication-notification-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12" y2="16"></line>
          </svg>
          <div class="medication-notification-text">
            <div class="medication-notification-title">Erreur</div>
            <div class="medication-notification-detail">Impossible d'ajouter au panier</div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add("show");
      }, 10);

      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
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
        <button
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
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
              src={
                typeof medication.image === "string" &&
                medication.image.startsWith("http")
                  ? medication.image
                  : typeof medication.image === "string" &&
                    medication.image.includes("/")
                  ? medication.image
                  : `${IMAGE_BASE_URL}${
                      typeof medication.image === "string"
                        ? medication.image
                        : medication.name.toLowerCase().replace(/\s+/g, "")
                    }.jpg`
              }
              alt={medication.name}
              onError={(e) => {
                console.log(
                  `Erreur de chargement d'image pour: ${medication.name}`
                );
                e.target.onerror = null;
                e.target.src = logoImg;
              }}
            />
          </div>
          <div className="detail-content">
            <span className="detail-category">{medication.category}</span>
            <h1 className="detail-name">{medication.name}</h1>
            <div className="detail-price">{medication.price.toFixed(2)} €</div>

            <p className="detail-description">{medication.description}</p>

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
                <span className="detail-meta-value">
                  {medication.packaging}
                </span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Praticien</span>
                {medication.practitioner ? (
                  <Link
                    to={`/practitioner/${medication.practitioner.id}`}
                    className="detail-meta-value"
                  >
                    {medication.practitioner.name}
                  </Link>
                ) : (
                  <span className="detail-meta-value">
                    Information non disponible
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f7f9fc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  overflow: "hidden",
                  width: "fit-content",
                  marginBottom: "20px",
                }}
              >
                <button
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "none",
                    border: "none",
                    cursor: quantity <= 1 ? "not-allowed" : "pointer",
                    color: quantity <= 1 ? "#cbd5e0" : "#007bff",
                    fontSize: "18px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span
                  style={{
                    minWidth: "40px",
                    padding: "0 15px",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#2d3748",
                  }}
                >
                  {quantity}
                </span>
                <button
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#007bff",
                    fontSize: "18px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={handleIncreaseQuantity}
                >
                  +
                </button>
              </div>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  maxWidth: "300px",
                }}
                onClick={handleAddToCart}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "10px" }}
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
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
            className={`tab-button ${
              activeTab === "description" ? "active" : ""
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab-button ${
              activeTab === "indications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("indications")}
          >
            Indications
          </button>
          <button
            className={`tab-button ${
              activeTab === "contraindications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("contraindications")}
          >
            Contre-indications
          </button>
          <button
            className={`tab-button ${
              activeTab === "sideEffects" ? "active" : ""
            }`}
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
          {relatedMedications.map((relatedMed) => (
            <MedicationCard key={relatedMed.id} medication={relatedMed} />
          ))}
        </div>
      </div>

      {/* Message élégant pour la connexion */}
      {showLoginMessage && (
        <div className="login-message">
          <div className="login-message-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
            <div>
              <h3>Connexion requise</h3>
              <p>
                Veuillez vous connecter pour ajouter des articles à votre
                panier.
              </p>
              <div className="login-buttons">
                <a href="/login" className="btn-login">
                  Se connecter
                </a>
                <a href="/register" className="btn-register">
                  S'inscrire
                </a>
              </div>
            </div>
            <button
              className="close-message"
              onClick={() => setShowLoginMessage(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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

export default MedicationDetail;
