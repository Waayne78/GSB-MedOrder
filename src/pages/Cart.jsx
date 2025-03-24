import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Cart.css";

const Cart = () => {
  // Simuler les données du panier pour la démo
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Cardiolex",
      price: 45.99,
      quantity: 2,
      image: "/placeholder-medication.jpg"
    },
    {
      id: 3,
      name: "Vasodil",
      price: 28.75,
      quantity: 1,
      image: "/placeholder-medication.jpg"
    }
  ]);
  
  const [shippingCost, setShippingCost] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  
  // Calculer le sous-total et les frais de livraison
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
    
    // Définir les frais de livraison (gratuit > 100€)
    setShippingCost(total > 100 ? 0 : 8.99);
  }, [cartItems]);
  
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleCheckout = () => {
    alert("Redirection vers la page de paiement...");
    // Ici vous ajouteriez la logique de redirection vers la page de paiement
  };

  // Si le panier est vide
  if (cartItems.length === 0) {
    return (
      <div className="cart-page container">
        <div className="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.55 13C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C21.25 4.82 20.77 4 20.01 4H5.21L4.27 2H1V4H3L6.6 11.59L5.25 14.04C4.52 15.37 5.48 17 7 17H19V15H7L8.1 13H15.55ZM6.16 6H18.31L15.55 11H8.53L6.16 6ZM7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
          </svg>
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des médicaments à votre panier pour passer une commande.</p>
          <Link to="/catalog" className="btn btn-primary">
            Parcourir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Votre panier</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header">
            <div>Produit</div>
            <div>Prix unitaire</div>
            <div>Quantité</div>
            <div>Total</div>
            <div></div>
          </div>
          
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-info">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div>
                  <div className="cart-item-name">{item.name}</div>
                </div>
              </div>
              
              <div className="cart-item-price" data-label="Prix unitaire:">
                {item.price.toFixed(2)} €
              </div>
              
              <div className="cart-item-quantity" data-label="Quantité:">
                <button 
                  className="quantity-btn minus" 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                  className="quantity-input"
                  min="1"
                />
                <button 
                  className="quantity-btn plus" 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <div className="cart-item-total" data-label="Total:">
                {(item.price * item.quantity).toFixed(2)} €
              </div>
              
              <button 
                className="cart-item-remove" 
                onClick={() => handleRemoveItem(item.id)}
                aria-label="Supprimer du panier"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2 className="summary-title">Récapitulatif</h2>
          
          <div className="summary-row">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          
          <div className="summary-row">
            <span>Frais de livraison</span>
            <span>
              {shippingCost === 0 ? (
                <span className="shipping-free">Gratuit</span>
              ) : (
                `${shippingCost.toFixed(2)} €`
              )}
            </span>
          </div>
          
          {shippingCost > 0 && (
            <div className="shipping-notice">
              <small>Livraison gratuite à partir de 100 €</small>
            </div>
          )}
          
          <div className="summary-row total">
            <span>Total</span>
            <span>{(subtotal + shippingCost).toFixed(2)} €</span>
          </div>
          
          <button 
            className="checkout-button" 
            onClick={handleCheckout}
          >
            Passer commande
          </button>
          
          <div className="continue-shopping">
            <Link to="/catalog">Continuer les achats</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 