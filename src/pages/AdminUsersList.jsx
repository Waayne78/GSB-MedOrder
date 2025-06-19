import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import authService from "../services/authService";
import orderService from "../services/orderService";
import "../styles/AdminUsersList.css";

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [userOrdersStats, setUserOrdersStats] = useState({});
  const [user] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const fetchUsers = async () => {
      if (user && user.role === "admin") {
        setLoading(true);
        setError(null);
        try {
          const res = await apiService.get("/admin/users");
          setUsers(res.data);
          
          // Récupérer les statistiques des commandes pour chaque utilisateur
          const stats = {};
          for (const userData of res.data) {
            try {
              const userStats = await orderService.getUserOrderStats(userData.id);
              stats[userData.id] = userStats;
            } catch (err) {
              console.error(`Erreur lors de la récupération des stats pour l'utilisateur ${userData.id}:`, err);
              stats[userData.id] = { totalOrders: 0, totalSpent: 0 };
            }
          }
          setUserOrdersStats(stats);
        } catch (err) {
          setError("Erreur lors du chargement des utilisateurs");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Dépendance vide car user est maintenant stable

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'doctor': return 'role-doctor';
      default: return 'role-user';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'doctor': return 'Médecin';
      default: return 'Utilisateur';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    doctors: users.filter(u => u.role === 'doctor').length,
    users: users.filter(u => u.role === 'user').length,
    totalOrders: Object.values(userOrdersStats).reduce((sum, stats) => sum + (stats.totalOrders || 0), 0),
    totalRevenue: Object.values(userOrdersStats).reduce((sum, stats) => sum + (stats.totalSpent || 0), 0)
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      apiService.delete(`/admin/users/${userId}`)
        .then(() => {
          setUsers(users.filter(u => u.id !== userId));
        })
        .catch(err => {
          alert("Erreur lors de la suppression de l'utilisateur");
        });
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-users-container">
        <div className="access-denied">
          <h2>🚫 Accès Refusé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-users-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users-container">
        <div className="error-container">
          <h3>Erreur</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h1 className="admin-users-title">👥 Gestion des Utilisateurs</h1>
        <p className="admin-users-subtitle">Administrez les comptes utilisateurs de votre plateforme</p>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Utilisateurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.admins}</div>
          <div className="stat-label">Administrateurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.doctors}</div>
          <div className="stat-label">Médecins</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.users}</div>
          <div className="stat-label">Utilisateurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalOrders}</div>
          <div className="stat-label">Total Commandes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalRevenue.toFixed(2)}<span className="euro">€</span></div>
          <div className="stat-label">Chiffre d'Affaires</div>
        </div>
      </div>

      <div className="users-table-container">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #dee2e6' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '0.9rem',
                minWidth: '250px'
              }}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '0.9rem',
                backgroundColor: 'white'
              }}
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="doctor">Médecins</option>
              <option value="user">Utilisateurs</option>
            </select>
            <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </span>
          </div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Commandes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {getInitials(u.firstname, u.lastname)}
                    </div>
                    <div className="user-details">
                      <h4>{u.firstname} {u.lastname}</h4>
                      <p>ID: {u.id}</p>
                    </div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(u.role)}`}>
                    {getRoleLabel(u.role)}
                  </span>
                </td>
                <td>
                  <div className="user-orders-info">
                    <div className="orders-count">
                      <span className="orders-number">
                        {userOrdersStats[u.id]?.totalOrders || 0}
                      </span>
                      <span className="orders-label">commandes</span>
                    </div>
                    <div className="orders-total">
                      {userOrdersStats[u.id]?.totalSpent ? 
                        `${userOrdersStats[u.id].totalSpent.toFixed(2)} €` : 
                        '0.00 €'
                      }
                    </div>
                  </div>
                </td>
                <td>
                  <div className="user-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => alert(`Modifier l'utilisateur ${u.firstname} ${u.lastname}`)}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteUser(u.id)}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: '#6c757d',
            fontSize: '1.1rem'
          }}>
            Aucun utilisateur trouvé avec les critères de recherche actuels.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersList;