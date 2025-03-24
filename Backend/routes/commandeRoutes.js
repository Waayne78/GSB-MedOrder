const express = require('express');
const commandeController = require('../controllers/commandeController');

const router = express.Router();

// Routes pour les commandes
router.post('/commandes', commandeController.createCommande);
router.get('/commandes', commandeController.getCommandes);
router.get('/commandes/:id', commandeController.getCommandeById);

module.exports = router;