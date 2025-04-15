import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import orderService from "../services/commandeService";
import "../styles/Cart.css";
import { FaShoppingCart, FaTrash, FaChevronLeft, FaCreditCard, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const IMAGE_BASE_URL = "http://localhost:3006/images/";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderStatus, setOrderStatus] = useState(null); // "success", "error", ou null
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  useEffect(() => {
    const items = cartService.getCartItems();
    setCartItems(items);
    setTotalPrice(cartService.getTotalPrice());
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    cartService.updateCartItemQuantity(itemId, newQuantity);
    const updatedItems = cartService.getCartItems();
    setCartItems(updatedItems);
    setTotalPrice(cartService.getTotalPrice());
  };

  const removeItem = (itemId) => {
    cartService.removeFromCart(itemId);
    const updatedItems = cartService.getCartItems();
    setCartItems(updatedItems);
    setTotalPrice(cartService.getTotalPrice());
  };

  const clearCart = () => {
    cartService.clearCart();
    setCartItems([]);
    setTotalPrice(0);
  };

  const proceedToCheckout = () => {
    if (cartItems.length > 0) {
      setCheckoutStep(2);
    }
  };

  const backToCart = () => {
    setCheckoutStep(1);
  };

  const handleOrder = async () => {
    try {
      setIsProcessing(true);
      
      const orderData = {
        items: cartItems,
        total: totalPrice,
        date: new Date().toISOString(),
      };

      console.log("Données envoyées à l'API :", orderData);

      const response = await orderService.createOrder(orderData);
      console.log("Réponse de l'API :", response);
      
      setOrderNumber(response.commandeId);
      setOrderStatus("success");
      setCheckoutStep(3);
      clearCart();
    } catch (error) {
      console.error("Erreur lors de la commande :", error);
      setOrderStatus("error");
      setCheckoutStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToOrders = () => {
    navigate("/mes-commandes");
  };

  // Panier vide
  if (cartItems.length === 0 && checkoutStep === 1) {
    return (
      <div className="cart-container empty-cart-container">
        <div className="empty-cart-content">
          <FaShoppingCart className="empty-cart-icon" />
          <h1>Votre panier est vide</h1>
          <p>Ajoutez des médicaments à votre panier pour passer commande.</p>
          <button className="btn-primary" onClick={goToHome}>
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  // Étape 1: Affichage du panier
  if (checkoutStep === 1) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h1><FaShoppingCart /> Mon panier</h1>
          <div className="cart-steps">
            <div className="step active">1. Panier</div>
            <div className="step">2. Validation</div>
            <div className="step">3. Confirmation</div>
          </div>
        </div>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image-container">
                  <img src={`${IMAGE_BASE_URL}${item.image}`} alt={item.name} className="item-image" />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">{item.price.toFixed(2)} €</p>
                  <div className="item-quantity-container">
                    <div className="item-quantity">
                      <button
                        className="quantity-button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="item-actions">
                  <p className="item-total">{(item.price * item.quantity).toFixed(2)} €</p>
                  <button
                    className="remove-item-button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Récapitulatif</h3>
            
            <div className="summary-row">
              <span>Total des articles</span>
              <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} article(s)</span>
            </div>
            
            <div className="summary-row">
              <span>Frais de livraison</span>
              <span>Gratuit</span>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            
            <button className="order-button" onClick={proceedToCheckout}>
              Valider le panier
            </button>
            
            <button className="clear-cart-button" onClick={clearCart}>
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Étape 2: Validation de la commande
  if (checkoutStep === 2) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h1><FaCreditCard /> Validation de la commande</h1>
          <div className="cart-steps">
            <div className="step completed">1. Panier</div>
            <div className="step active">2. Validation</div>
            <div className="step">3. Confirmation</div>
          </div>
        </div>
        
        <div className="checkout-content">
          <div className="checkout-summary">
            <h3>Résumé de votre commande</h3>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-quantity">x{item.quantity}</span>
                  <span className="checkout-item-price">{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            
            <div className="checkout-total">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
          
          <div className="checkout-actions">
            <button className="back-button" onClick={backToCart}>
              <FaChevronLeft /> Retour au panier
            </button>
            <button 
              className="confirm-order-button" 
              onClick={handleOrder}
              disabled={isProcessing}
            >
              {isProcessing ? 'Traitement en cours...' : 'Confirmer la commande'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Étape 3: Confirmation de commande
  if (checkoutStep === 3) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h1>
            {orderStatus === "success" ? (
              <>
                <FaCheckCircle className="success-icon" /> Commande confirmée
              </>
            ) : (
              <>
                <FaExclamationCircle className="error-icon" /> Erreur
              </>
            )}
          </h1>
          <div className="cart-steps">
            <div className="step completed">1. Panier</div>
            <div className="step completed">2. Validation</div>
            <div className="step active">3. Confirmation</div>
          </div>
        </div>
        
        <div className="confirmation-content">
          {orderStatus === "success" ? (
            <>
              <div className="confirmation-message">
                <FaCheckCircle className="confirmation-icon success" />
                <h2>Votre commande a été passée avec succès</h2>
                <p>Numéro de commande: <strong>#{orderNumber}</strong></p>
                <p>Vous recevrez bientôt un email de confirmation avec les détails de votre commande.</p>
              </div>
              <div className="confirmation-actions">
                <button className="secondary-button" onClick={goToHome}>
                  Retour à l'accueil
                </button>
                <button className="primary-button" onClick={goToOrders}>
                  Voir mes commandes
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="confirmation-message">
                <FaExclamationCircle className="confirmation-icon error" />
                <h2>Une erreur est survenue</h2>
                <p>Nous n'avons pas pu traiter votre commande. Veuillez réessayer plus tard.</p>
              </div>
              <div className="confirmation-actions">
                <button className="secondary-button" onClick={backToCart}>
                  Retour au panier
                </button>
                <button className="primary-button" onClick={goToHome}>
                  Retour à l'accueil
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default Cart;
