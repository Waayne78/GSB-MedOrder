const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const pharmacistRoutes = require('./routes/pharmacistRoutes');
const practitionerRoutes = require('./routes/practitionerRoutes');
const suiviCommandesRoutes = require('./routes/suiviCommandesRoutes');
const commandeDetailsRoutes = require('./routes/commandeDetailsRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gestion des erreurs de connexion à la base de données
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error('Erreur globale:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'API GSB MedOrder fonctionnelle' });
});

// Import des routes de manière sécurisée
try {
  // Déclaration des variables de routes (une seule fois)
  const medicationRoutes = require('./routes/medicationRoutes');
  const practitionerRoutes = require('./routes/practitionerRoutes');
  
  // Utilisation des routes
  app.use('/api', medicationRoutes);
  app.use('/api', practitionerRoutes);
  
  console.log('Routes chargées avec succès');
} catch (error) {
  console.error('Erreur lors du chargement des routes:', error);
}

// Servir les images statiques
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ message: 'Une erreur est survenue !' });
});

// Routes API
app.use('/api/auth', authRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion des erreurs non capturées pour éviter les crashs
process.on('uncaughtException', (err) => {
  console.error('Erreur non capturée:', err);
});