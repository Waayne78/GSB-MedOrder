const express = require('express');
const medicamentController = require('../controllers/medicamentController');

const router = express.Router();

// Routes pour les médicaments
router.post('/medicaments', medicamentController.createMedicament);
router.get('/medicaments', medicamentController.getMedicaments);
router.get('/medicaments/:id', medicamentController.getMedicamentById);

module.exports = router;