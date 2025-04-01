import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../styles/MedicationCard.css';
import logoImg from "../assets/logo.jpg"; // Import de l'image de placeholder
import authService from '../services/authService';
import cartService from '../services/cartService';

const MedicationCard = ({ medication, onLoginRequired }) => {
  const navigate = useNavigate();

  // Fonction pour normaliser les chemins d'images
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === '/placeholder-medication.jpg') {
      return '/assets/placeholder-medication.jpg';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return `${window.location.origin}${imagePath}`;
    }
    
    return `/assets/medications/${imagePath}`;
  };

  // Gérer les erreurs d'image
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/assets/default-medication.png';
  };

  const handleAddToCart = () => {
    // Temporairement, juste un message pour simuler l'ajout au panier
    alert(`Ajouté au panier : ${medication.name}`);
  };

  // Vérifier si l'objet medication et ses propriétés existent
  if (!medication) {
    return (
      <div className="medication-card error-card">
        <p>Information sur le médicament non disponible</p>
      </div>
    );
  }

  return (
    <div className="medication-card">
      <div className="medication-image">
        <img 
          src={getImageUrl(medication.image)} 
          alt={medication.name} 
          onError={handleImageError}
        />
        <div className={`medication-category ${medication.category.toLowerCase()}`}>
          {medication.category}
        </div>
      </div>
      
      <div className="medication-info">
        <h3 className="medication-name">{medication.name}</h3>
        <p className="medication-price">{medication.price ? medication.price.toFixed(2) : "0.00"} €</p>
        
        <div className="medication-description">
          {medication.description && medication.description.length > 100 
            ? `${medication.description.substring(0, 100)}...` 
            : medication.description}
        </div>
        
        {medication.practitioner && (
          <p className="medication-practitioner">
            Praticien: {medication.practitioner.name}
          </p>
        )}
        
        <div className="medication-actions">
          <Link to={`/medication/${medication.id}`} className="btn-details">
            Détails
          </Link>
          
          <button className="btn-add-to-cart" onClick={handleAddToCart}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 9H13V6H16V4H13V1H11V4H8V6H11V9ZM7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18ZM7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L21.16 4.96L19.42 4H19.41L18.31 6L15.55 11H8.53L8.4 10.73L6.16 6L5.21 4L4.27 2H1V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.29 15 7.17 14.89 7.17 14.75Z" fill="currentColor"/>
            </svg>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;