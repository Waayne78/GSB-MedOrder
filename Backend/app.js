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

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error('Erreur globale:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'API GSB MedOrder fonctionnelle' });
});

try {
  const medicationRoutes = require('./routes/medicationRoutes');
  const practitionerRoutes = require('./routes/practitionerRoutes');
  
  app.use('/api', medicationRoutes);
  app.use('/api', practitionerRoutes);
  
  console.log('Routes chargées avec succès');
} catch (error) {
  console.error('Erreur lors du chargement des routes:', error);
}

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ message: 'Une erreur est survenue !' });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Erreur non capturée:', err);
});