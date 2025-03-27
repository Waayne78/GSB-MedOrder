const express = require('express');
const bodyParser = require('body-parser');
const practitionerRoutes = require('./routes/practitionerRoutes');
const medicamentRoutes = require('./routes/medicamentRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const suiviCommandeRoutes = require('./routes/suiviCommandeRoutes');
const ligneCommandeRoutes = require('./routes/ligneCommandeRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', practitionerRoutes);
app.use('/api', medicamentRoutes);
app.use('/api', commandeRoutes);
app.use('/api', suiviCommandeRoutes);
app.use('/api', ligneCommandeRoutes);

// Route pour la racine (/)
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API GSB !');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
