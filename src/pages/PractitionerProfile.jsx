import { useParams } from 'react-router-dom';
import './styles/main.css';

const PractitionerProfile = () => {
  const { id } = useParams();

  // Données simulées (à remplacer par un appel API plus tard)
  const practitioners = [
    {
      id: 1,
      name: "Dr. Dupont",
      specialty: "Médicaments génériques",
      image: "url-image",
      description: "Spécialiste en médicaments génériques avec plus de 10 ans d'expérience.",
      medications: [
        { id: 1, name: "Paracétamol", price: 5.99, stock: 100 },
        { id: 2, name: "Ibuprofène", price: 7.99, stock: 50 },
      ],
    },
    {
      id: 2,
      name: "Dr. Martin",
      specialty: "Produits de santé naturels",
      image: "url-image",
      description: "Expert en produits de santé naturels et compléments alimentaires.",
      medications: [
        { id: 3, name: "Vitamine C", price: 12.99, stock: 30 },
        { id: 4, name: "Oméga-3", price: 15.99, stock: 20 },
      ],
    },
  ];

  const practitioner = practitioners.find(p => p.id === parseInt(id));

  if (!practitioner) {
    return <div>Praticien non trouvé</div>;
  }

  return (
    <div className="practitioner-profile">
      <div className="profile-header">
        <img src={practitioner.image} alt={practitioner.name} />
        <h1>{practitioner.name}</h1>
        <p>{practitioner.specialty}</p>
      </div>
      <div className="profile-description">
        <h2>À propos</h2>
        <p>{practitioner.description}</p>
      </div>
      <div className="medications-list">
        <h2>Médicaments disponibles</h2>
        {practitioner.medications.map(medication => (
          <div key={medication.id} className="medication-card">
            <h3>{medication.name}</h3>
            <p>Prix : {medication.price} €</p>
            <p>Stock : {medication.stock}</p>
            <button>Commander</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PractitionerProfile;