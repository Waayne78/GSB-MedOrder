import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Contactez-nous</h1>
          <p className="contact-subtitle">
            Notre équipe est là pour vous aider et répondre à toutes vos
            questions
          </p>
        </div>
      </div>

      <div class="contact-info">
  <div class="info-header">
    <h2>Contactez-nous</h2>
    <p>Voici comment nous contacter pour plus d’informations</p>
  </div>
  
  <div class="info-cards">
    <div class="info-card">
      <div class="info-icon">
        <i class="fas fa-map-marker-alt"></i> 
      </div>
      <div class="info-text">
        <h3>Adresse</h3>
        <p>123 Rue Exemple, Paris, France</p>
      </div>
    </div>
    
    <div class="info-card">
      <div class="info-icon">
        <i class="fas fa-phone-alt"></i> 
      </div>
      <div class="info-text">
        <h3>Téléphone</h3>
        <p>+33 1 23 45 67 89</p>
      </div>
    </div>
    
    <div class="info-card">
      <div class="info-icon">
        <i class="fas fa-envelope"></i> 
      </div>
      <div class="info-text">
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
