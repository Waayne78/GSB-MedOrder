import { useState, useEffect } from "react";
import authService from "../services/authService";
import orderService from "../services/orderService";
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

        // Appel à l'API pour récupérer les commandes de l'utilisateur
        const userOrders = await orderService.getUserOrders(user.id);

        setOrders(userOrders);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes:", err);
        setError(
          err.response?.data?.message ||
            "Impossible de charger vos commandes. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setError("Vous devez être connecté pour voir vos commandes.");
      setLoading(false);
    }
  }, [user]);

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
              <h3>Commande #{order.id}</h3>
              <p>Date : {new Date(order.created_at).toLocaleDateString()}</p>
              <p>Montant total : {order.total_price} €</p>
              <p>Statut : {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
