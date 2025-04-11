const express = require('express');
const router = express.Router();
const db = require('../config/db');
const orderController = require("../controllers/commandeController");

// Obtenir toutes les commandes
router.get('/commandes', async (req, res) => {
    try {
        const [commandes] = await db.query('SELECT * FROM commandes');
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Créer une nouvelle commande
router.post('/commandes', async (req, res) => {
    const { date_commande, statut, pharmacist_id } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO commandes (date_commande, statut, pharmacist_id) VALUES (?, ?, ?)',
            [date_commande, statut, pharmacist_id]
        );
        res.status(201).json({ id: result.insertId, message: 'Commande créée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour une commande
router.put('/commandes/:id', async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;
    try {
        await db.query('UPDATE commandes SET statut = ? WHERE id = ?', [statut, id]);
        res.json({ message: 'Commande mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour récupérer les commandes d'un utilisateur
router.get("/user/:userId", orderController.getUserOrders);

module.exports = router;