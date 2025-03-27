const express = require('express');
const router = express.Router();
const medicamentController = require('../controllers/medicamentController');

router.get('/medicaments', medicamentController.getAllMedicaments);
router.post('/medicaments', medicamentController.addMedicament);
router.put('/medicaments/:id', medicamentController.updateMedicament);

module.exports = router;
