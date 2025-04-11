import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import authService from "../services/authService";
import cartService from "../services/cartService";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { clearCart } from "../store/cartSlice";
import Logo from "../assets/logo.jpg";
import "../styles/Navbar.css";

const Navbar = () => {
  // États existants
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Nouvel état pour le menu utilisateur
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(0);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const authUser = useSelector((state) => state.auth.user);

  console.log("État d'authentification:", isLoggedIn);
  console.log("User dans le store:", user);

  // Fonction pour vérifier l'authentification
  const checkAuth = () => {
    try {
      const authenticated = authService.isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        setUser(authService.getCurrentUser());
        updateCartCount();
      } else {
        setUser(null);
        setCartItems(0);
      }
    } catch (error) {
      console.error("Erreur dans checkAuth:", error);
      setIsLoggedIn(false);
      setUser(null);
      setCartItems(0);
    }
  };

  // Mettre à jour le nombre d'articles dans le panier
  const updateCartCount = () => {
    try {
      // Utiliser getTotalItems au lieu de getCartItemsCount
      const count = cartService.getTotalItems();
      setCartItems(count);
    } catch (error) {
      console.error("Erreur dans updateCartCount:", error);
      setCartItems(0);
    }
  };

  // Vérifier l'authentification au chargement et écouter les changements dans le localStorage
  useEffect(() => {
    try {
      // Initialiser le service d'authentification
      authService.initialize();

      // Vérifier l'authentification
      checkAuth();

      // Écouter les changements dans le localStorage
      const handleStorageChange = () => {
        checkAuth();
      };

      window.addEventListener("storage", handleStorageChange);

      // Nettoyer l'écouteur d'événements
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    } catch (error) {
      console.error("Erreur dans useEffect du Navbar:", error);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    try {
      authService.logout();
      setIsLoggedIn(false);
      setUser(null);
      dispatch(logout());
      dispatch(clearCart());
      cartService.clearCart();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Fonction pour obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (user && user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header
      className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${
        isLoggedIn ? "user-authenticated" : ""
      }`}
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={Logo} alt="GSB MedOrder" />
            <span>MedOrder</span>
          </Link>
        </div>

        <nav className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Accueil
          </NavLink>
          <NavLink
            to="/catalogue"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Catalogue
          </NavLink>
          {/* Commentez temporairement ce lien s'il cause des problèmes */}
          {/* {isLoggedIn && (
            <NavLink
              to="/mes-commandes"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Mes commandes
            </NavLink>
          )} */}
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contact
          </NavLink>
        </nav>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <Link to="/panier" className="navbar-cart">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                    fill="currentColor"
                  />
                </svg>
                {cartItems > 0 && (
                  <span className="cart-count">{cartItems}</span>
                )}
              </Link>
              <div className="user-menu">
                <Link to="/profil" className="user-avatar">
                  <div className="avatar-circle">
                    <span>{getUserInitials()}</span>
                  </div>
                  <span className="user-name">
                    {user
                      ? user.lastname || user.lastName
                        ? user.lastname || user.lastName
                        : user && user.email
                        ? user.email.split("@")[0]
                        : "utilisateur"
                      : "utilisateur"}
                  </span>
                </Link>
                <div className="user-dropdown">
                  <Link to="/profil" className="dropdown-item">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="currentColor"
                      />
                    </svg>
                    Mon profil
                  </Link>
                  <Link to="/mes-commandes" className="dropdown-item">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Mes commandes
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
                        fill="currentColor"
                      />
                    </svg>
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary">
                Inscription
              </Link>
            </>
          )}
        </div>

        <button
          className={`navbar-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
