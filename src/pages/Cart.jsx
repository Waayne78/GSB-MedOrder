import React, { useState, useEffect } from "react";
import cartService from "../services/cartService";
import orderService from "../services/commandeService";
import "../styles/Cart.css";

const IMAGE_BASE_URL = "http://localhost:3006/images/";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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

  const handleOrder = async () => {
    try {
      const orderData = {
        items: cartItems,
        total: totalPrice,
        date: new Date().toISOString(),
      };

      console.log("Données envoyées à l'API :", orderData);

      const response = await orderService.createOrder(orderData);

      console.log("Réponse de l'API :", response);

      clearCart();
      alert(`Commande passée avec succès ! ID de la commande : ${response.commandeId}`);
    } catch (error) {
      console.error("Erreur lors de la commande :", error);
      alert("Une erreur est survenue lors de la commande.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>Mon panier</h1>
        <p className="empty-cart">Votre panier est vide.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Mon panier</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={`${IMAGE_BASE_URL}${item.image}`} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">Prix : {item.price} €</p>
                <div className="item-quantity">
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                <p className="item-total">Total : {(item.price * item.quantity).toFixed(2)} €</p>
                <button
                  className="remove-item-button"
                  onClick={() => removeItem(item.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3 className="summary-total">Total : {totalPrice.toFixed(2)} €</h3>
          <button className="order-button" onClick={handleOrder}>
            Passer la commande
          </button>
          <button className="clear-cart-button" onClick={clearCart}>
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
