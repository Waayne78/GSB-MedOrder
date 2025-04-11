import React, { useState, useEffect } from "react";
import cartService from "../services/cartService";
import "../styles/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Charger les articles du panier au montage du composant
  useEffect(() => {
    const items = cartService.getCartItems();
    setCartItems(items);
    setTotalPrice(cartService.getTotalPrice());
  }, []);

  // Mettre à jour la quantité d'un article
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    cartService.updateCartItemQuantity(itemId, newQuantity);
    const updatedItems = cartService.getCartItems();
    setCartItems(updatedItems);
    setTotalPrice(cartService.getTotalPrice());
  };

  // Supprimer un article
  const removeItem = (itemId) => {
    cartService.removeFromCart(itemId);
    const updatedItems = cartService.getCartItems();
    setCartItems(updatedItems);
    setTotalPrice(cartService.getTotalPrice());
  };

  // Vider le panier
  const clearCart = () => {
    cartService.clearCart();
    setCartItems([]);
    setTotalPrice(0);
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
      <h1>Mon panier</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Prix : {item.price} €</p>
              <div className="item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="remove-item" onClick={() => removeItem(item.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total : {totalPrice.toFixed(2)} €</h3>
        <button onClick={clearCart}>Vider le panier</button>
      </div>
    </div>
  );
};

export default Cart;
