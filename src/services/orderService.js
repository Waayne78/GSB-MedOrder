import axios from "axios";

const API_URL = "http://localhost:3006/api";

// Récupérer les commandes d'un utilisateur
const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    throw error;
  }
};

// Récupérer les statistiques des commandes d'un utilisateur
const getUserOrderStats = async (userId) => {
  try {
    const orders = await getUserOrders(userId);
    
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageRating: 0,
        lastOrder: null
      };
    }

    // Calculer les statistiques
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => {
      return sum + (parseFloat(order.montant_total) || 0);
    }, 0);

    // Trouver la dernière commande
    const lastOrder = orders.length > 0 
      ? new Date(Math.max(...orders.map(order => new Date(order.date_commande))))
      : null;

    // Calculer une note moyenne fictive (vous pouvez adapter selon vos besoins)
    const averageRating = orders.length > 0 ? (4.2 + Math.random() * 0.6).toFixed(1) : 0;

    return {
      totalOrders,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      averageRating: parseFloat(averageRating),
      lastOrder: lastOrder ? lastOrder.toISOString().split('T')[0] : null
    };
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      averageRating: 0,
      lastOrder: null
    };
  }
};

const orderService = {
  getUserOrders,
  getUserOrderStats
};

export default orderService;