const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const medicamentRoutes = require('./routes/medicamentRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const stockRoutes = require('./routes/stockRoutes');
const ligneCommandeRoutes = require('./routes/ligneCommandeRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', medicamentRoutes);
app.use('/api', commandeRoutes);
app.use('/api', stockRoutes);
app.use('/api', ligneCommandeRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});