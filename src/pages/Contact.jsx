import { useState } from "react";
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis:", formData);
    // Ici vous mettriez la logique d'envoi du formulaire
    // Pour l'instant, on simule juste une soumission réussie
    setFormSubmitted(true);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contactez-nous</h1>
        
        <div className="contact-container">
          <div className="contact-info">
            <h2>Informations de contact</h2>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h3>Adresse</h3>
                <p>123 Rue Pharmaceutique, 75000 Paris, France</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h3>Téléphone</h3>
                <p>+33 1 23 45 67 89</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>contact@gsb-medorder.fr</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">🕒</div>
              <div>
                <h3>Heures d'ouverture</h3>
                <p>Lundi - Vendredi: 9h00 - 18h00</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            {formSubmitted ? (
              <div className="form-success">
                <h2>Message envoyé !</h2>
                <p>Nous vous répondrons dans les plus brefs délais.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setFormSubmitted(false)}
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <>
                <h2>Envoyez-nous un message</h2>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Nom complet</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Sujet</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Envoyer
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;