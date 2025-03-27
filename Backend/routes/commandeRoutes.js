const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');

router.get('/commandes', commandeController.getAllCommandes);
router.post('/commandes', commandeController.createCommande);
router.get('/commandes/:id', commandeController.getCommandeById);

module.exports = router;
