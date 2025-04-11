import "../styles/Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Section Héro */}
      <div className="contact-hero">
        <div className="container">
          <h1>Contactez-nous</h1>
          <p className="contact-subtitle">
            Nous sommes là pour répondre à toutes vos questions et vous aider.
          </p>
        </div>
      </div>

      {/* Section Informations */}
      <div className="contact-info">
        <div className="info-header">
          <h2>Nos coordonnées</h2>
          <p>Voici comment nous joindre pour toute information ou assistance.</p>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">
              <FontAwesomeIcon icon="map-marker-alt" />
            </div>
            <div className="info-text">
              <h3>Adresse</h3>
              <p>123 Rue Exemple, Paris, France</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FontAwesomeIcon icon="phone-alt" />
            </div>
            <div className="info-text">
              <h3>Téléphone</h3>
              <p>+33 1 23 45 67 89</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FontAwesomeIcon icon="envelope" />
            </div>
            <div className="info-text">
              <h3>Email</h3>
              <p>contact@exemple.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
