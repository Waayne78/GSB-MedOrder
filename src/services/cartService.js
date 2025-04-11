const CART_KEY = "cart";

// Récupérer les articles du panier
const getCartItems = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

// Ajouter un article au panier
const addToCart = (item) => {
  const cart = getCartItems();
  const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

  if (existingItemIndex !== -1) {
    // Si l'article existe déjà, mettre à jour la quantité
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    // Ajouter un nouvel article
    cart.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Supprimer un article du panier
const removeFromCart = (itemId) => {
  const cart = getCartItems();
  const updatedCart = cart.filter((item) => item.id !== itemId);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
};

// Mettre à jour la quantité d'un article
const updateCartItemQuantity = (itemId, quantity) => {
  const cart = getCartItems();
  const updatedCart = cart.map((item) =>
    item.id === itemId ? { ...item, quantity } : item
  );
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
};

// Vider le panier
const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

// Obtenir le nombre total d'articles
const getTotalItems = () => {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Obtenir le prix total du panier
const getTotalPrice = () => {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export default {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  getTotalItems,
  getTotalPrice,
};
