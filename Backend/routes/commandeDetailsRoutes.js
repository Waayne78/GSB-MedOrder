const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtenir tous les détails de commandes
router.get('/commande_details', async (req, res) => {
    try {
        const [commandeDetails] = await db.query('SELECT * FROM commande_details');
        res.json(commandeDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir les détails d'une commande spécifique
router.get('/commande_details/commande/:id', async (req, res) => {
    try {
        const [commandeDetails] = await db.query(
            'SELECT * FROM commande_details WHERE commande_id = ?', 
            [req.params.id]
        );
        res.json(commandeDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 