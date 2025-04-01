const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtenir tous les suivis de commandes
router.get('/suivi_commandes', async (req, res) => {
    try {
        const [suiviCommandes] = await db.query('SELECT * FROM suivi_commandes');
        res.json(suiviCommandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir un suivi de commande par ID
router.get('/suivi_commandes/:id', async (req, res) => {
    try {
        const [suiviCommande] = await db.query('SELECT * FROM suivi_commandes WHERE id = ?', [req.params.id]);
        if (suiviCommande.length === 0) {
            return res.status(404).json({ message: 'Suivi de commande non trouvé' });
        }
        res.json(suiviCommande[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 