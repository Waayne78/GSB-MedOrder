const express = require('express');
const router = express.Router();
const ligneCommandeController = require('../controllers/ligneCommandeController');

router.post('/ligne-commande', ligneCommandeController.addLigneCommande);
router.get('/ligne-commande/:commande_id', ligneCommandeController.getLignesCommande);

module.exports = router;
