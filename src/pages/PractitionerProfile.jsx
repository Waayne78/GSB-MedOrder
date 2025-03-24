import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/PractitionerProfile.css";
import MedicationCard from "../components/MedicationCard";

const PractitionerProfile = () => {
  const { id } = useParams();
  const [practitioner, setPractitioner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulation d'une requête API
    const fetchPractitioner = async () => {
      try {
        setLoading(true);
        // Remplacez par un appel API réel
        // const response = await api.get(`/practitioners/${id}`);
        // setPractitioner(response.data);
        
        // Données de test
        setTimeout(() => {
          setPractitioner({
            id: id,
            name: "Dr. Jean Dubois",
            title: "Médecin Généraliste",
            specialty: "Cardiologie",
            image: "/placeholder-doctor.jpg",
            description: "Le Dr. Jean Dubois est un cardiologue expérimenté avec plus de 15 ans de pratique. Spécialiste des maladies cardiovasculaires, il a effectué ses études à la faculté de médecine de Paris et a complété sa spécialisation à l'Hôpital Européen Georges-Pompidou. Il est membre de la Société Française de Cardiologie.",
            location: "Paris, France",
            email: "jean.dubois@gsb.fr",
            phone: "+33 1 23 45 67 89",
            experience: "15 ans",
            education: "Faculté de Médecine de Paris",
            medications: [
              {
                id: 1,
                name: "Cardiolex",
                category: "Cardiologie",
                price: 45.99,
                image: "/placeholder-medication.jpg",
                description: "Médicament pour le traitement des maladies cardiovasculaires."
              },
              {
                id: 2,
                name: "Tensiostat",
                category: "Cardiologie",
                price: 32.5,
                image: "/placeholder-medication.jpg",
                description: "Traitement contre l'hypertension artérielle."
              },
              {
                id: 3,
                name: "Vasodil",
                category: "Cardiologie",
                price: 28.75,
                image: "/placeholder-medication.jpg",
                description: "Médicament vasodilatateur pour améliorer la circulation sanguine."
              }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Erreur lors du chargement des données du praticien");
        setLoading(false);
      }
    };

    fetchPractitioner();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des informations du praticien...</p>
      </div>
    );
  }

  if (error || !practitioner) {
    return (
      <div className="error-container">
        <h2>Une erreur s'est produite</h2>
        <p>{error || "Impossible de trouver ce praticien"}</p>
        <button className="btn btn-primary" onClick={() => window.history.back()}>
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="practitioner-profile container">
      <div className="profile-header">
        <div className="profile-image">
          <img src={practitioner.image} alt={practitioner.name} />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{practitioner.name}</h1>
          <p className="profile-title">{practitioner.title}</p>
          <span className="profile-specialty">{practitioner.specialty}</span>
          
          <div className="profile-meta">
            <div className="profile-meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
              </svg>
              <span>{practitioner.location}</span>
            </div>
            <div className="profile-meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
              </svg>
              <span>{practitioner.email}</span>
            </div>
            <div className="profile-meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
              </svg>
              <span>{practitioner.phone}</span>
            </div>
            <div className="profile-meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
              </svg>
              <span>Expérience: {practitioner.experience}</span>
            </div>
          </div>
          
          <p className="profile-description">{practitioner.description}</p>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-section">
            <h2 className="profile-section-title">Médicaments proposés</h2>
            <div className="profile-medications">
              {practitioner.medications.map(medication => (
                <MedicationCard key={medication.id} medication={medication} />
              ))}
            </div>
          </div>
          
          <div className="profile-section">
            <h2 className="profile-section-title">Formation et parcours</h2>
            <p>
              <strong>Formation :</strong> {practitioner.education}
            </p>
            <p>
              <strong>Expérience :</strong> {practitioner.experience}
            </p>
            <p>
              <strong>Spécialité :</strong> {practitioner.specialty}
            </p>
          </div>
        </div>
        
        <div className="profile-sidebar">
          <div className="profile-section profile-contact-form">
            <h2 className="profile-section-title">Contacter le praticien</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nom</label>
                <input type="text" id="name" placeholder="Votre nom" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Votre email" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Votre message"></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerProfile;