const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router();

// Routes pour les stocks
router.post('/stocks', stockController.createStock);
router.get('/stocks', stockController.getStocks);
router.get('/stocks/:id', stockController.getStockById);

module.exports = router;