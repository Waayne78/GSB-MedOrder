import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import apiService from '../services/apiService';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          const mockOrders = [
            {
              id: 1,
              orderDate: new Date().toISOString(),
              status: 'PROCESSING',
              items: [
                { name: 'Paracétamol 500mg', quantity: 2, price: 3.50 },
                { name: 'Ibuprofène 200mg', quantity: 1, price: 4.20 }
              ]
            },
            {
              id: 2,
              orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'DELIVERED',
              items: [
                { name: 'Doliprane 1000mg', quantity: 1, price: 5.30 },
                { name: 'Vitamine C', quantity: 3, price: 4.75 }
              ]
            }
          ];
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Erreur lors du chargement des commandes:', err);
        setError('Impossible de charger l\'historique des commandes. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="order-history-container">
      <h1>Historique de mes commandes</h1>
      
      {loading ? (
        <div className="loading-spinner">Chargement de vos commandes...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <p>Vous n'avez pas encore passé de commande.</p>
          <button 
            className="browse-catalog-btn"
            onClick={() => navigate('/medications')}
          >
            Parcourir le catalogue
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div className="order-info">
                  <span className="order-number">Commande #{order.id}</span>
                  <span className="order-date">{formatDate(order.orderDate)}</span>
                </div>
                <div className={`order-status status-${order.status.toLowerCase()}`}>
                  {order.status === 'PENDING' && 'En attente'}
                  {order.status === 'PROCESSING' && 'En cours de traitement'}
                  {order.status === 'SHIPPED' && 'Expédiée'}
                  {order.status === 'DELIVERED' && 'Livrée'}
                  {order.status === 'CANCELLED' && 'Annulée'}
                </div>
              </div>
              
              <div className="order-items">
                <h3>Produits commandés</h3>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className="order-item">
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">Quantité: {item.quantity}</span>
                      </div>
                      <span className="item-price">{(item.price * item.quantity).toFixed(2)} €</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  <span>Total</span>
                  <span className="total-amount">{calculateOrderTotal(order.items)} €</span>
                </div>
                <button 
                  className="reorder-btn"
                  onClick={() => navigate(`/medications`)}
                >
                  Commander à nouveau
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;