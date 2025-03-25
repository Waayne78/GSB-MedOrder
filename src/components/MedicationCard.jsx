import { Link } from "react-router-dom";
import '../styles/MedicationCard.css'  // Assurez-vous que cette ligne existe


const MedicationCard = ({ medication }) => {
  const handleAddToCart = () => {
    // Temporairement, juste un message pour simuler l'ajout au panier
    alert(`Ajouté au panier : ${medication.name}`);
  };

  return (
    <div className="medication-card">
      <div className="medication-image">
        <img 
          src={medication.image || "/placeholder-medication.jpg"} 
          alt={medication.name} 
        />
        <span className="medication-category">{medication.category}</span>
      </div>
      
      <div className="medication-info">
        <h3 className="medication-name">{medication.name}</h3>
        <p className="medication-price">{medication.price.toFixed(2)} €</p>
        
        <div className="medication-description">
          {medication.description && medication.description.substring(0, 100)}
          {medication.description && medication.description.length > 100 && "..."}
        </div>
        
        <div className="medication-actions">
          <Link to={`/medication/${medication.id}`} className="btn-details">
            Détails
          </Link>
          
          <button className="btn-add-to-cart" onClick={handleAddToCart}>
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;