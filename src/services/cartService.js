import authService from './authService';

const CART_STORAGE_KEY = 'gsb_medorder_cart';

// Définition du service avec toutes les méthodes nécessaires
const cartService = {
  // Obtenir le panier
  getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart;
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      return [];
    }
  },
  
  // Ajouter un article au panier
  addToCart(item) {
    try {
      const cart = this.getCart();
      
      // Vérifier si l'article existe déjà dans le panier
      const existingItem = cart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Mettre à jour la quantité si l'article existe déjà
        existingItem.quantity += item.quantity || 1;
      } else {
        // Ajouter le nouvel article
        cart.push({
          ...item,
          quantity: item.quantity || 1
        });
      }
      
      // Enregistrer le panier mis à jour
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Émettre un événement pour informer les autres composants
      window.dispatchEvent(new Event('storage'));
      
      return cart;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      return [];
    }
  },
  
  // Mettre à jour la quantité d'un article
  updateQuantity(itemId, quantity) {
    try {
      const cart = this.getCart();
      
      // Trouver l'article à mettre à jour
      const itemToUpdate = cart.find(item => item.id === itemId);
      
      if (itemToUpdate) {
        // Mettre à jour la quantité
        itemToUpdate.quantity = quantity;
        
        // Filtrer les articles avec une quantité <= 0
        const updatedCart = cart.filter(item => item.quantity > 0);
        
        // Enregistrer le panier mis à jour
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Émettre un événement pour informer les autres composants
        window.dispatchEvent(new Event('storage'));
        
        return updatedCart;
      }
      
      return cart;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      return [];
    }
  },
  
  // Supprimer un article du panier
  removeFromCart(itemId) {
    try {
      const cart = this.getCart();
      
      // Filtrer pour supprimer l'article
      const updatedCart = cart.filter(item => item.id !== itemId);
      
      // Enregistrer le panier mis à jour
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Émettre un événement pour informer les autres composants
      window.dispatchEvent(new Event('storage'));
      
      return updatedCart;
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un article:', error);
      return [];
    }
  },
  
  // Vider le panier
  clearCart() {
    try {
      // Supprimer le panier du localStorage
      localStorage.removeItem('cart');
      
      // Émettre un événement pour informer les autres composants
      window.dispatchEvent(new Event('storage'));
      
      return [];
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      return [];
    }
  },
  
  // Calculer le total du panier
  getCartTotal() {
    try {
      const cart = this.getCart();
      
      // Calculer le total
      const total = cart.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
      }, 0);
      
      return parseFloat(total.toFixed(2));
    } catch (error) {
      console.error('Erreur lors du calcul du total du panier:', error);
      return 0;
    }
  },
  
  // Obtenir le nombre total d'articles dans le panier
  getTotalItems() {
    try {
      const cart = this.getCart();
      
      // Calculer le nombre total d'articles
      const totalItems = cart.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0);
      
      return totalItems;
    } catch (error) {
      console.error('Erreur lors du calcul du nombre d\'articles:', error);
      return 0;
    }
  }
};

// Assurez-vous d'exporter par défaut le service (correction de l'erreur)
export default cartService; 