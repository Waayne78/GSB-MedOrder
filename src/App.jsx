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
import AdminUsersList from "./pages/AdminUsersList";
import './styles/global.css';
import authService from './services/authService';
import ErrorBoundary from "./components/ErrorBoundary";
import "./utils/fontAwesome";

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
    const isInitialized = authService.initialize();
    if (!isInitialized) {
      console.warn("L'utilisateur n'est pas authentifié.");
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <ErrorBoundary>
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
              <Route path="/admin/users" element={<AdminUsersList />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;