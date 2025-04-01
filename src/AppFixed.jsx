import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MedicationCatalog from './pages/MedicationCatalog';
import MedicationDetail from './pages/MedicationDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import PractitionerProfile from './pages/PractitionerProfile';
import Contact from './pages/Contact';

function AppFixed() {
  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<MedicationCatalog />} />
            <Route path="/medication/:id" element={<MedicationDetail />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/practitioner/:id" element={<PractitionerProfile />} />
            <Route path="/contact" element={<Contact />} />
            {/* Temporairement commenté si problématique */}
            {/* <Route path="/mes-commandes" element={<OrderHistory />} /> */}
            {/* <Route path="/profil" element={<UserProfile />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppFixed; 