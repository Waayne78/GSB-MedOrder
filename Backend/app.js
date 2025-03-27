const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
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
app.use('/api/users', userRoutes);  // Préfixe pour les routes utilisateurs
app.use('/api/medicaments', medicamentRoutes);  // Préfixe pour les routes médicaments
app.use('/api/commandes', commandeRoutes);  // Préfixe pour les routes commandes
app.use('/api/suivi-commandes', suiviCommandeRoutes);  // Préfixe pour les routes suivi des commandes
app.use('/api/ligne-commandes', ligneCommandeRoutes);  // Préfixe pour les routes lignes de commande

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
