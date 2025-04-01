import { createSlice } from "@reduxjs/toolkit";

// Récupérer les éléments du panier depuis localStorage s'ils existent
const getCartFromStorage = () => {
  try {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return [];
  }
};

const initialState = {
  items: getCartFromStorage(),
  total: getCartFromStorage().reduce((sum, item) => sum + (item.price * item.quantity), 0),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === id);
      
      if (existingItemIndex !== -1) {
        // Si l'article existe déjà, augmenter sa quantité
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Sinon, ajouter le nouvel article
        state.items.push({ id, name, price, image, quantity });
      }
      
      // Recalculer le total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Sauvegarder dans localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      
      // Recalculer le total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Sauvegarder dans localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
      }
      
      // Recalculer le total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Sauvegarder dans localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      
      // Supprimer du localStorage
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 