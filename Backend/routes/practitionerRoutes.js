const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtenir tous les praticiens
router.get('/practitioners', async (req, res) => {
    try {
        const [practitioners] = await db.query('SELECT * FROM practitioners');
        res.json(practitioners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir un praticien par son ID
router.get('/practitioners/:id', async (req, res) => {
    try {
        const [practitioner] = await db.query('SELECT * FROM practitioners WHERE id = ?', [req.params.id]);
        if (practitioner.length === 0) {
            return res.status(404).json({ message: 'Praticien non trouvé' });
        }
        res.json(practitioner[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;