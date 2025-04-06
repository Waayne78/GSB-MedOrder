import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/PractitionerProfile.css";
import authService from "../services/authService";
import cartService from "../services/cartService";
import apiService from "../services/apiService";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";


const PractitionerProfile = () => {
  const { id } = useParams();
  const [practitioner, setPractitioner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const fetchPractitioner = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(
          `http://localhost:3006/api/practitioners/${id}`
        );
        setPractitioner(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données du praticien");
        setLoading(false);
      }
    };

    fetchPractitioner();
  }, [id]);

  const showNotification = ({ type, title, message }) => {
    const notification = document.createElement("div");
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
      <div class="cart-notification-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${
            type === "success"
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
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const handleAddToCart = (medication, event) => {
    if (!authService.isAuthenticated()) {
      setShowLoginDialog(true);
      return;
    }

    try {
      const itemToAdd = {
        id: medication.id,
        name: medication.name,
        price: medication.price,
        category: medication.category,
        image: medication.image,
        quantity: 1,
      };

      const button = event.currentTarget;
      button.classList.add("success-animation");

      cartService.addToCart(itemToAdd);

      showNotification({
        type: "success",
        title: "Produit ajouté au panier",
        message: `${medication.name} ajouté au panier`,
      });

      setTimeout(() => {
        button.classList.remove("success-animation");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);

      showNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible d'ajouter le produit au panier.",
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="practitioner-profile">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {practitioner.name && practitioner.name.split(" ")[1]?.charAt(0)}
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{practitioner.name}</h1>
          <p className="profile-title">{practitioner.specialty}</p>
  
          <div className="profile-detail"><FaEnvelope /> <span>{practitioner.email}</span></div>
          <div className="profile-detail"><FaPhone /> <span>{practitioner.phone}</span></div>
          <div className="profile-detail"><FaMapMarkerAlt /> <span>{practitioner.location}</span></div>
          <div className="profile-detail"><FaBriefcase /> <span>{practitioner.experience} ans d'expérience</span></div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerProfile;
