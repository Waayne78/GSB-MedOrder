import { motion } from 'framer-motion';

const PractitionerCard = ({ id, name, specialty, image }) => {
  return (
    <motion.div
      className="practitioner-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{specialty}</p>
      <a href={`/practitioner/${id}`}>Voir les médicaments</a>
    </motion.div>
  );
};
  export default PractitionerCard;