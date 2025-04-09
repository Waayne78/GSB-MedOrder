import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cartService from "../services/cartService";
import "../styles/Cart.css";
import authService from "../services/authService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const items = await cartService.getCartItems(user.id);
        setCartItems(items);
        setTotalPrice(cartService.getTotalPrice());
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du panier :", err);
        setError(
          err.response?.data?.message ||
            "Impossible de charger le panier. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    if (user) {
      loadCart();
    } else {
      setError("Vous devez être connecté pour voir votre panier.");
      setLoading(false);
    }

    window.addEventListener("cart-updated", loadCart);

    return () => {
      window.removeEventListener("cart-updated", loadCart);
    };
  }, [user]);

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      cartService.updateQuantity(id, quantity);
    }
  };

  const handleRemoveItem = (id) => {
    cartService.removeFromCart(id);
  };

  const handleClearCart = () => {
    // Créer une boîte de dialogue de confirmation personnalisée
    const confirmDialog = document.createElement("div");
    confirmDialog.className = "cart-confirm-dialog";
    confirmDialog.innerHTML = `
      <div class="confirm-dialog-content">
        <div class="confirm-dialog-header">
          <h3>Vider le panier</h3>
          <button class="close-dialog">×</button>
        </div>
        <div class="confirm-dialog-body">
          <p>Êtes-vous sûr de vouloir vider votre panier ?</p>
          <p class="dialog-items-count">Tous les articles (${cartItems.length}) seront supprimés.</p>
        </div>
        <div class="confirm-dialog-footer">
          <button class="btn-cancel">Annuler</button>
          <button class="btn-confirm">Vider le panier</button>
        </div>
      </div>
    `;

    document.body.appendChild(confirmDialog);

    // Animation d'apparition
    setTimeout(() => {
      confirmDialog.classList.add("show");
    }, 10);

    // Gestionnaires d'événements pour les boutons
    const closeButton = confirmDialog.querySelector(".close-dialog");
    const cancelButton = confirmDialog.querySelector(".btn-cancel");
    const confirmButton = confirmDialog.querySelector(".btn-confirm");

    const closeDialog = () => {
      confirmDialog.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(confirmDialog);
      }, 300);
    };

    closeButton.addEventListener("click", closeDialog);
    cancelButton.addEventListener("click", closeDialog);

    confirmButton.addEventListener("click", () => {
      // Animation de suppression des éléments
      const cartItemElements = document.querySelectorAll(".cart-item");

      // Ajouter une classe d'animation à chaque élément avec un délai croissant
      cartItemElements.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("item-removing");
        }, index * 100);
      });

      // Attendre que les animations soient terminées avant de vider le panier
      setTimeout(() => {
        cartService.clearCart();
        closeDialog();

        // Afficher une notification de confirmation
        const notification = document.createElement("div");
        notification.className = "cart-notification";
        notification.innerHTML = `
          <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
            </svg>
            <span>Votre panier a été vidé</span>
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
      }, cartItemElements.length * 100 + 300);
    });
  };

  if (loading) {
    return <p>Chargement du panier...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="cart-page">
      <h1>Mon Panier</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Votre panier est vide.</p>
          <Link to="/catalog" className="btn btn-primary">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img
                    src={
                      item.image && item.image.startsWith("http")
                        ? item.image
                        : `http://localhost:3006/images/${item.image}`
                    }
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo.jpg";
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">
                    {parseFloat(item.price).toFixed(2)} €
                  </p>
                  <p className="item-category">{item.category}</p>
                </div>
                <div className="item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Supprimer
                  </button>
                </div>
                <div className="item-subtotal">
                  <p>{(parseFloat(item.price) * item.quantity).toFixed(2)} €</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <button className="clear-cart" onClick={handleClearCart}>
              Vider le panier
            </button>
            <div className="cart-total">
              <p>Total :</p>
              <p className="total-price">{totalPrice.toFixed(2)} €</p>
            </div>
            <Link to="/checkout" className="btn btn-primary checkout-button">
              Passer commande
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
