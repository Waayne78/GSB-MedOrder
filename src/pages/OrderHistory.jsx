import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import apiService from '../services/apiService';
import '../styles/OrderHistory.css';
import { FaSearch, FaFilter, FaChevronDown, FaFileDownload, FaEye, FaShoppingBasket, FaClock, FaCheck, FaBox, FaTimesCircle, FaTruck, FaSortAmountDown, FaSortAmountUp, FaCalendarAlt } from 'react-icons/fa';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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
              orderNumber: 'CMD-12345',
              orderDate: new Date().toISOString(),
              status: 'PROCESSING',
              items: [
                { id: 1, name: 'Paracétamol 500mg', quantity: 2, price: 3.50, image: 'paracetamol.jpg' },
                { id: 2, name: 'Ibuprofène 200mg', quantity: 1, price: 4.20, image: 'ibuprofen.jpg' }
              ],
              address: {
                street: '123 Rue des Médicaments',
                city: 'Paris',
                zipCode: '75001',
                country: 'France'
              },
              payment: {
                method: 'Carte bancaire',
                last4: '4242'
              },
              estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 2,
              orderNumber: 'CMD-12346',
              orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'DELIVERED',
              items: [
                { id: 3, name: 'Doliprane 1000mg', quantity: 1, price: 5.30, image: 'doliprane.jpg' },
                { id: 4, name: 'Vitamine C', quantity: 3, price: 4.75, image: 'vitaminc.jpg' }
              ],
              address: {
                street: '123 Rue des Médicaments',
                city: 'Paris',
                zipCode: '75001',
                country: 'France'
              },
              payment: {
                method: 'Carte bancaire',
                last4: '4242'
              },
              deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 3,
              orderNumber: 'CMD-12347',
              orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'SHIPPED',
              items: [
                { id: 5, name: 'Aspirine 500mg', quantity: 2, price: 4.25, image: 'aspirine.jpg' },
                { id: 6, name: 'Mélatonine', quantity: 1, price: 7.99, image: 'melatonine.jpg' }
              ],
              address: {
                street: '123 Rue des Médicaments',
                city: 'Paris',
                zipCode: '75001',
                country: 'France'
              },
              payment: {
                method: 'Paypal'
              },
              trackingNumber: 'TRK123456789',
              estimatedDelivery: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 4,
              orderNumber: 'CMD-12348',
              orderDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'CANCELLED',
              items: [
                { id: 7, name: 'Antalgique', quantity: 1, price: 6.50, image: 'antalgique.jpg' }
              ],
              address: {
                street: '123 Rue des Médicaments',
                city: 'Paris',
                zipCode: '75001',
                country: 'France'
              },
              payment: {
                method: 'Carte bancaire',
                last4: '1234'
              },
              cancellationReason: 'Annulation à la demande du client'
            }
          ];
          setOrders(mockOrders);
          setFilteredOrders(mockOrders);
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

  useEffect(() => {
    // Filtrer et trier les commandes
    let result = [...orders];

    // Filtrage par recherche
    if (searchTerm) {
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status.toLowerCase() === statusFilter);
    }

    // Filtrage par date
    if (dateFilter === 'last30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(order => new Date(order.orderDate) >= thirtyDaysAgo);
    } else if (dateFilter === 'last90') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      result = result.filter(order => new Date(order.orderDate) >= ninetyDaysAgo);
    }

    // Tri des commandes
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.orderDate) - new Date(b.orderDate)
          : new Date(b.orderDate) - new Date(a.orderDate);
      } else if (sortBy === 'price') {
        const totalA = calculateOrderTotal(a.items);
        const totalB = calculateOrderTotal(b.items);
        return sortOrder === 'asc' ? totalA - totalB : totalB - totalA;
      }
      return 0;
    });

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const renderStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'processing':
        return <FaBox className="status-icon processing" />;
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'delivered':
        return <FaCheck className="status-icon delivered" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'En attente';
      case 'processing': return 'En préparation';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div className="order-history-page">
    <div className="order-history-container">
        <div className="page-header">
      <h1>Historique de mes commandes</h1>
          <p className="page-description">Consultez et gérez vos commandes passées</p>
        </div>
      
      {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement de vos commandes...</p>
          </div>
      ) : error ? (
          <div className="error-message">
            <FaExclamationCircle /> {error}
            <button className="retry-button" onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        ) : (
          <>
            <div className="order-controls">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <button className="filter-toggle" onClick={toggleFilterPanel}>
                <FaFilter /> Filtres
                <FaChevronDown className={isFilterOpen ? 'chevron rotated' : 'chevron'} />
              </button>
              
              <div className="sort-container">
                <span>Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="date">Date</option>
                  <option value="price">Prix</option>
                </select>
                <button className="sort-direction" onClick={toggleSortOrder}>
                  {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
                </button>
              </div>
            </div>

            {isFilterOpen && (
              <div className="filter-panel">
                <div className="filter-section">
                  <h3>Statut</h3>
                  <div className="filter-options">
                    <label className={statusFilter === 'all' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="statusFilter"
                        value="all"
                        checked={statusFilter === 'all'}
                        onChange={() => setStatusFilter('all')}
                      />
                      <span>Tous</span>
                    </label>
                    <label className={statusFilter === 'pending' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="statusFilter"
                        value="pending"
                        checked={statusFilter === 'pending'}
                        onChange={() => setStatusFilter('pending')}
                      />
                      <span>En attente</span>
                    </label>
                    <label className={statusFilter === 'processing' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="statusFilter"
                        value="processing"
                        checked={statusFilter === 'processing'}
                        onChange={() => setStatusFilter('processing')}
                      />
                      <span>En préparation</span>
                    </label>
                    <label className={statusFilter === 'shipped' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="statusFilter"
                        value="shipped"
                        checked={statusFilter === 'shipped'}
                        onChange={() => setStatusFilter('shipped')}
                      />
                      <span>Expédiée</span>
                    </label>
                    <label className={statusFilter === 'delivered' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="statusFilter"
                        value="delivered"
                        checked={statusFilter === 'delivered'}
                        onChange={() => setStatusFilter('delivered')}
                      />
                      <span>Livrée</span>
                    </label>
                    <label className={statusFilter === 'cancelled' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="statusFilter"
                        value="cancelled"
                        checked={statusFilter === 'cancelled'}
                        onChange={() => setStatusFilter('cancelled')}
                      />
                      <span>Annulée</span>
                    </label>
                  </div>
                </div>
                
                <div className="filter-section">
                  <h3>Période</h3>
                  <div className="filter-options">
                    <label className={dateFilter === 'all' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="dateFilter"
                        value="all"
                        checked={dateFilter === 'all'}
                        onChange={() => setDateFilter('all')}
                      />
                      <span>Toutes les périodes</span>
                    </label>
                    <label className={dateFilter === 'last30' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="dateFilter"
                        value="last30"
                        checked={dateFilter === 'last30'}
                        onChange={() => setDateFilter('last30')}
                      />
                      <span>30 derniers jours</span>
                    </label>
                    <label className={dateFilter === 'last90' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="dateFilter"
                        value="last90"
                        checked={dateFilter === 'last90'}
                        onChange={() => setDateFilter('last90')}
                      />
                      <span>90 derniers jours</span>
                    </label>
                  </div>
                </div>
                
                <div className="filter-actions">
                  <button className="clear-filters" onClick={clearFilters}>
                    Effacer les filtres
                  </button>
                </div>
              </div>
            )}

            {filteredOrders.length === 0 ? (
        <div className="empty-orders">
                <div className="empty-orders-icon">
                  <FaShoppingBasket />
                </div>
                <h2>Aucune commande trouvée</h2>
                <p>Nous n'avons trouvé aucune commande correspondant à vos critères de recherche.</p>
                {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Effacer les filtres
                  </button>
                )}
          <button 
            className="browse-catalog-btn"
                  onClick={() => navigate('/catalogue')}
          >
            Parcourir le catalogue
          </button>
        </div>
      ) : (
        <div className="orders-list">
                {filteredOrders.map((order) => (
                  <div className="order-card" key={order.id} onClick={() => handleOrderClick(order)}>
              <div className="order-header">
                <div className="order-info">
                        <span className="order-number">{order.orderNumber}</span>
                        <span className="order-date">
                          <FaCalendarAlt /> {formatDate(order.orderDate)}
                        </span>
                      </div>
                      <div className={`order-status status-${order.status.toLowerCase()}`}>
                        {renderStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                    </div>
                    
                    <div className="order-preview">
                      <div className="order-items-preview">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="preview-item">
                            <span className="preview-item-name">{item.name}</span>
                            <span className="preview-item-quantity">x{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="more-items">
                            +{order.items.length - 2} produit(s) supplémentaire(s)
                          </div>
                        )}
                      </div>
                      
                      <div className="order-total-preview">
                        <span className="total-label">Total</span>
                        <span className="total-amount">{calculateOrderTotal(order.items).toFixed(2)} €</span>
                      </div>
                    </div>
                    
                    <div className="order-actions">
                      <button className="view-details-btn">
                        <FaEye /> Voir les détails
                      </button>
                      {order.status.toLowerCase() === 'delivered' && (
                        <button className="reorder-btn" onClick={(e) => {
                          e.stopPropagation();
                          navigate('/catalogue');
                        }}>
                          Commander à nouveau
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-backdrop" onClick={closeOrderDetails}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={closeOrderDetails}>&times;</button>
            
            <div className="modal-header">
              <h2>Détails de la commande {selectedOrder.orderNumber}</h2>
              <div className={`order-status status-${selectedOrder.status.toLowerCase()}`}>
                {renderStatusIcon(selectedOrder.status)}
                <span>{getStatusText(selectedOrder.status)}</span>
              </div>
            </div>
            
            <div className="order-details-content">
              <div className="order-info-section">
                <div className="order-info-block">
                  <h3>Informations générales</h3>
                  <p><strong>Date de commande:</strong> {formatDate(selectedOrder.orderDate)}</p>
                  {selectedOrder.deliveryDate && (
                    <p><strong>Date de livraison:</strong> {formatDate(selectedOrder.deliveryDate)}</p>
                  )}
                  {selectedOrder.estimatedDelivery && (
                    <p><strong>Livraison estimée:</strong> {formatDate(selectedOrder.estimatedDelivery)}</p>
                  )}
                  {selectedOrder.trackingNumber && (
                    <p><strong>Numéro de suivi:</strong> {selectedOrder.trackingNumber}</p>
                  )}
                </div>
                
                <div className="order-info-block">
                  <h3>Adresse de livraison</h3>
                  <p>{selectedOrder.address.street}</p>
                  <p>{selectedOrder.address.zipCode} {selectedOrder.address.city}</p>
                  <p>{selectedOrder.address.country}</p>
                </div>
                
                <div className="order-info-block">
                  <h3>Moyen de paiement</h3>
                  <p>{selectedOrder.payment.method}</p>
                  {selectedOrder.payment.last4 && (
                    <p>**** **** **** {selectedOrder.payment.last4}</p>
                  )}
                </div>
              </div>
              
              <div className="order-items-list">
                <h3>Produits commandés</h3>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-detail-item">
                    <div className="item-image-placeholder">
                      {/* <img src={`/images/${item.image}`} alt={item.name} /> */}
                    </div>
                      <div className="item-details">
                      <h4>{item.name}</h4>
                      <div className="item-meta">
                        <span className="quantity">Quantité: {item.quantity}</span>
                        <span className="price">Prix unitaire: {item.price.toFixed(2)} €</span>
                      </div>
                    </div>
                    <div className="item-total-price">
                      {(item.price * item.quantity).toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Sous-total</span>
                  <span>{calculateOrderTotal(selectedOrder.items).toFixed(2)} €</span>
                </div>
                <div className="summary-row">
                  <span>Frais de livraison</span>
                  <span>Gratuit</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>{calculateOrderTotal(selectedOrder.items).toFixed(2)} €</span>
                </div>
              </div>
              
              <div className="order-detail-actions">
                <button className="download-invoice">
                  <FaFileDownload /> Télécharger la facture
                </button>
                {selectedOrder.status.toLowerCase() === 'delivered' && (
                  <button className="reorder-all" onClick={() => navigate('/catalogue')}>
                    Commander à nouveau
                  </button>
                )}
                {selectedOrder.status.toLowerCase() === 'pending' && (
                  <button className="cancel-order">
                    Annuler la commande
                  </button>
                )}
              </div>
              
              {selectedOrder.status.toLowerCase() === 'cancelled' && selectedOrder.cancellationReason && (
                <div className="cancellation-info">
                  <h3>Motif d'annulation</h3>
                  <p>{selectedOrder.cancellationReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;