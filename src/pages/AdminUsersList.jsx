import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import authService from "../services/authService";

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
    return <div>Accès refusé</div>;
  }

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.firstname} {u.lastname} ({u.email}) - {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsersList;