import { Link } from "react-router-dom";
import "../styles/PractitionerCard.css"; // Assurez-vous que cette ligne existe

const PractitionerCard = ({ practitioner }) => {
    if (!practitioner) {
      return <p>Erreur : Aucune donnée de praticien disponible.</p>;
    }
  
    return (
      <div className="practitioner-card">
        <div className="practitioner-image">
          <img
            src={practitioner.image || "/placeholder-doctor.jpg"}
            alt={practitioner.name}
          />
          <span className="practitioner-specialty">{practitioner.specialty}</span>
        </div>
  
        <div className="practitioner-info">
          <h3 className="practitioner-name">{practitioner.name}</h3>
          <p className="practitioner-title">{practitioner.title}</p>
  
          <div className="practitioner-meta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                fill="currentColor"
              />
            </svg>
            <span>{practitioner.location}</span>
          </div>
  
          <p className="practitioner-description">
            {practitioner.description?.substring(0, 100)}
            {practitioner.description?.length > 100 && "..."}
          </p>
  
          <div className="practitioner-actions">
            <Link
              to={`/practitioner/${practitioner.id}`}
              className="btn-view-profile"
            >
              Voir le profil
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  

export default PractitionerCard;
