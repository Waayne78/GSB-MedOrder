const express = require('express');
const router = express.Router();
const suiviCommandeController = require('../controllers/suiviCommandeController');

router.post('/suivi', suiviCommandeController.addSuiviCommande);
router.get('/suivi/:commande_id', suiviCommandeController.getSuiviCommande);

module.exports = router;
    