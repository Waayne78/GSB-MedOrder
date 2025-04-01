import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Commandez vos médicaments<br />
          <span className="highlight">facilement</span> et{' '}
          <span className="highlight">en toute sécurité</span>
        </h1>
        <p>
          GSB MedOrder simplifie la commande de médicaments pour les
          professionnels de la santé avec une plateforme intuitive et
          sécurisée.
        </p>
        <div className="hero-buttons">
          <Link to="/catalogue" className="btn btn-primary">
            Explorer le catalogue
          </Link>
          <Link to="/register" className="btn btn-outline">
            Créer un compte
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;