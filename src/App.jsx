import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MedicationCatalog from './pages/MedicationCatalog';
import MedicationDetail from './pages/MedicationDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import PractitionerProfile from './pages/PractitionerProfile';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import OrderHistory from './pages/OrderHistory';
import './styles/global.css';
import authService from './services/authService';

// Composant ProtectedRoute pour protéger les routes qui nécessitent une authentification
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  useEffect(() => {
    // Initialiser le service d'authentification au chargement de l'application
    authService.initialize();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<MedicationCatalog />} />
            <Route path="/medication/:id" element={<MedicationDetail />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/practitioner/:id" element={<PractitionerProfile />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Routes protégées qui nécessitent une authentification */}
            <Route path="/profil" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/mes-commandes" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;