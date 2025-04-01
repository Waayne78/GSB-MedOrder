const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtenir tous les médicaments
router.get('/medications', async (req, res) => {
    try {
        const [medications] = await db.query('SELECT * FROM medications');
        res.json(medications);
    } catch (error) {
        console.error('Erreur lors de la récupération des médicaments:', error);
        res.status(500).json({ message: error.message });
    }
});

// Obtenir un médicament par son ID
router.get('/medications/:id', async (req, res) => {
    try {
        const [medication] = await db.query('SELECT * FROM medications WHERE id = ?', [req.params.id]);
        if (medication.length === 0) {
            return res.status(404).json({ message: 'Médicament non trouvé' });
        }
        res.json(medication[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du médicament:', error);
        res.status(500).json({ message: error.message });
    }
});

// Rechercher des médicaments
router.get('/medications/search/:term', async (req, res) => {
    try {
        const [medications] = await db.query(
            'SELECT * FROM medications WHERE name LIKE ? OR description LIKE ?',
            [`%${req.params.term}%`, `%${req.params.term}%`]
        );
        res.json(medications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 