import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/MedicationDetails.css";
import logoImg from "../assets/logo.jpg";
import MedicationCard from "../components/MedicationCard";
import cartService from "../services/cartService";
import authService from "../services/authService";
import medicationService from "../services/medicationService";
import practitionerService from "../services/practitionerService";

const IMAGE_BASE_URL = "http://localhost:3006/images/";

const MedicationDetail = () => {
  const { id } = useParams();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        const response = await medicationService.getAllMedications();
        const medicationData = response.data.find(
          (med) => med.id === parseInt(id)
        );

        console.log("Médicament récupéré :", medicationData); // Vérifiez ici

        if (medicationData && medicationData.practitioner_id) {
          console.log("practitioner_id trouvé :", medicationData.practitioner_id);
          const practitioner = await practitionerService.getPractitionerById(
            medicationData.practitioner_id
          );
          console.log("Praticien récupéré :", practitioner);
          medicationData.practitioner = practitioner; // Ajoutez les données du praticien
        } else {
          console.log("practitioner_id non trouvé dans medicationData");
        }

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
    if (!isNaN(value) && value > 0) setQuantity(value);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = (event) => {
    if (!authService.isAuthenticated()) {
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
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);

      setTimeout(() => button.classList.remove("success-animation"), 1500);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
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
                medication.image && medication.image.startsWith("http")
                  ? medication.image
                  : `${IMAGE_BASE_URL}${
                      medication.image ||
                      medication.name.toLowerCase().replace(/\s+/g, "")
                    }`
              }
              alt={medication.name}
              onError={(e) => {
                console.error(
                  `Erreur de chargement d'image pour: ${medication.name}`
                );
                console.error("URL échouée :", e.target.src);
                e.target.onerror = null;
                e.target.src = logoImg;
              }}
            />
            {console.log("URL générée pour l'image :", {
              image: medication.image,
              url:
                medication.image && medication.image.startsWith("http")
                  ? medication.image
                  : `${IMAGE_BASE_URL}${
                      medication.image ||
                      medication.name.toLowerCase().replace(/\s+/g, "")
                    }`,
            })}
          </div>
          <div className="detail-content">
            <span className="detail-category">{medication.category}</span>
            <h1 className="detail-name">{medication.name}</h1>
            <div className="detail-price">
              {medication.price
                ? parseFloat(medication.price).toFixed(2)
                : "N/A"}{" "}
              €
            </div>
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
                <span className="detail-meta-label">Praticien associé</span>
                <span className="detail-meta-value">
                  {medication.practitioner
                    ? medication.practitioner.name
                    : "Non spécifié"}
                </span>
              </div>
            </div>

            <div className="quantity-section">
              <button onClick={handleDecreaseQuantity} disabled={quantity <= 1}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={handleIncreaseQuantity}>+</button>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail;
