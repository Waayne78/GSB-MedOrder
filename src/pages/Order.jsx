import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import "../styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Si vous avez un service pour récupérer les commandes, utilisez-le ici
        // Par exemple : const response = await orderService.getUserOrders();
        
        // Pour l'instant, simulons des données vides
        const mockOrders = [];
        
        setOrders(mockOrders);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes:", err);
        setError("Impossible de charger vos commandes. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-spinner"></div>
        <p>Chargement de vos commandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error-message">
          <h3>Une erreur est survenue</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Mes commandes</h1>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>Vous n'avez pas encore passé de commande.</p>
          <a href="/catalog" className="btn btn-primary">
            Parcourir le catalogue
          </a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Affichage des détails de la commande */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;