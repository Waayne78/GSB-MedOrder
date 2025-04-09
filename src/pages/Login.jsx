import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Réinitialiser les erreurs
    setError("");

    // Validation simple
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);

      // Appel au service d'authentification pour la connexion
      await authService.login(email, password);

      // Redirection vers la page d'accueil après la connexion réussie
      navigate("/");
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(err || "Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Connexion</h2>
          <p>Bienvenue sur GSB MedOrder</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
