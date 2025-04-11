import React, { useState, useEffect } from "react";
import cartService from "../services/cartService";
import orderService from "../services/commandeService"; // Importer le service pour les commandes
import "../styles/Cart.css";
import axios from "axios";

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
        items: cartItems, // Les articles du panier
        total: totalPrice, // Le prix total
        date: new Date().toISOString(), // La date actuelle
      };

      console.log("Données envoyées à l'API :", orderData);

      // Appeler l'API pour enregistrer la commande
      const response = await orderService.createOrder(orderData);

      console.log("Réponse de l'API :", response);

      // Vider le panier après la commande
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
        <p>Votre panier est vide.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Panier</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={`${IMAGE_BASE_URL}${item.image}`} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Prix : {item.price} €</p>
                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <p>Total : {(item.price * item.quantity).toFixed(2)} €</p>
                <button
                  className="remove-item"
                  onClick={() => removeItem(item.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Total : {totalPrice.toFixed(2)} €</h3>
          <button className="order-button" onClick={handleOrder}>
            Commander
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
