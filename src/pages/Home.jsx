import HeroSection from '../components/HeroSection';
import './styles/main.css';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <section className="highlights">
        <h2>Pourquoi choisir PharmaConnect ?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>📦 Livraison Rapide</h3>
            <p>Commandez vos médicaments et recevez-les sous 24h.</p>
          </div>
          <div className="feature-card">
            <h3>👨⚕️ Praticiens Certifiés</h3>
            <p>Collaboration avec des professionnels de santé agréés.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;