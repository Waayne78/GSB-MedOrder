import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import authService from "../services/authService";
import "../styles/Admin.css"; // Ajoute cette ligne

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (user && user.role === "admin") {
      apiService.get("/admin/users")
        .then(res => setUsers(res.data))
        .catch(err => alert("Erreur lors du chargement des utilisateurs"));
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <div className="admin-users-list access-denied">Accès refusé</div>;
  }

  return (
    <div className="admin-users-list">
      <div className="admin-users-card">
        <h2>Liste des utilisateurs</h2>
        <ul>
          {users.map(u => (
            <li key={u.id}>
              <span className="user-name">{u.firstname} {u.lastname}</span>
              <span className="user-email">({u.email})</span>
              <span className={`user-role ${u.role}`}>{u.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminUsersList;