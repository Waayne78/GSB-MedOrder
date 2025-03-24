import PractitionerCard from '../components/PractitionerCard';
import './styles/main.css';

const Order = () => {
  // Données simulées (à remplacer par un appel API plus tard)
  const practitioners = [
    { id: 1, name: "Dr. Dupont", specialty: "Médicaments génériques", image: "url-image" },
    { id: 2, name: "Dr. Martin", specialty: "Produits de santé naturels", image: "url-image" },
  ];

  return (
    <div className="order-page">
      <h1>Choisissez un praticien</h1>
      <div className="practitioners-grid">
        {practitioners.map(practitioner => (
          <PractitionerCard key={practitioner.id} {...practitioner} />
        ))}
      </div>
    </div>
  );
};

export default Order;