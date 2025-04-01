import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  // Pendant le chargement, on peut afficher un spinner
  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }
  
  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si authentifié, afficher le contenu protégé
  return children;
};

export default ProtectedRoute; 