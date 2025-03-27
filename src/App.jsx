import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Order from './pages/Order';
import MedicationCatalog from './pages/MedicationCatalog';
import MedicationDetail from './pages/MedicationDetail';
import PractitionerProfile from './pages/PractitionerProfile';
import Navbar from './components/Navbar';
import Login from './pages/login';
import Register from "./pages/Register";
import './styles/global.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<Order />} />
        <Route path="/practitioner/:id" element={<PractitionerProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<MedicationCatalog />} />
        <Route path="/medication/:id" element={<MedicationDetail />} />
      </Routes>
    </Router>
  );
}

export default App;