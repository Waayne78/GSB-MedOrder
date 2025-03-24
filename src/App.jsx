import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Order from './pages/Order';
import PractitionerProfile from './pages/PractitionerProfile';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<Order />} />
        <Route path="/practitioner/:id" element={<PractitionerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;