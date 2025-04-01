import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
// Importez vos styles si nécessaire

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Vérifier l'état de connexion à chaque rendu du Header
  useEffect(() => {
    // Récupérer l'utilisateur du localStorage
    const checkAuth = () => {
      if (localStorage.getItem("isAuthenticated")) {
        const userData = authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    // Ajoutez un événement de stockage pour détecter les changements dans localStorage
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/");
  };

  return (
    <header>
      <div className="container">
        <Link to="/" className="logo">
          GSB MedOrder
        </Link>

        <nav>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/catalog">Catalogue</Link></li>
            {/* Autres liens de navigation */}
          </ul>
        </nav>

        <div className="auth-buttons">
          {user ? (
            <>
              <span className="welcome-text">Bonjour, {user.firstName}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Connexion</Link>
              <Link to="/register" className="register-btn">Inscription</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;