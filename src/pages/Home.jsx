import { Link } from "react-router-dom";
import "../styles/Home.css";
import heroImage from "../assets/hero-image.jpg";
import HeroSection from "../components/HeroSection";

const Home = () => {
  return (
    <div className="home">
      {/* Section Hero */}
      <HeroSection />

      {/* Section Fonctionnalités */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Nos fonctionnalités</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="feature-title">Catalogue complet</h3>
              <p className="feature-description">
                Accédez à notre vaste catalogue de médicaments avec des informations détaillées sur chaque produit.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="feature-title">Sécurité garantie</h3>
              <p className="feature-description">
                Toutes vos commandes et informations personnelles sont cryptées et sécurisées.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="feature-title">Suivi des commandes</h3>
              <p className="feature-description">
                Suivez l'état de vos commandes en temps réel, de la préparation à la livraison.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img src={heroImage} alt="À propos de GSB MedOrder" />
            </div>
            <div className="about-content">
              <h2 className="section-title">À propos de Galaxy Swiss Bourdin</h2>
              <p>
                Galaxy Swiss Bourdin (GSB) est un groupe pharmaceutique né de la fusion entre le géant américain Galaxy et le conglomérat européen Swiss Bourdin.
              </p>
              <p>
                Notre laboratoire développe des médicaments innovants pour améliorer la santé et le bien-être des patients du monde entier. GSB MedOrder est notre solution pour simplifier la commande et la distribution de nos produits auprès des professionnels de santé.
              </p>
              <Link to="/about" className="btn btn-primary">En savoir plus</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Ce que disent nos clients</h2>
          <div className="testimonials-slider">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "GSB MedOrder a complètement transformé la façon dont nous gérons nos approvisionnements en médicaments. L'interface est intuitive et les commandes sont livrées rapidement."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-author-info">
                  <div className="testimonial-author-name">Dr. Sophie Martin</div>
                  <div className="testimonial-author-role">Pharmacienne, Paris</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;