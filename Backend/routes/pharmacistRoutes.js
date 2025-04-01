const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtenir tous les pharmaciens
router.get('/pharmacists', async (req, res) => {
    try {
        const [pharmacists] = await db.query('SELECT * FROM pharmacists');
        res.json(pharmacists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir un pharmacien par son ID
router.get('/pharmacists/:id', async (req, res) => {
    try {
        const [pharmacist] = await db.query('SELECT * FROM pharmacists WHERE id = ?', [req.params.id]);
        if (pharmacist.length === 0) {
            return res.status(404).json({ message: 'Pharmacien non trouvé' });
        }
        res.json(pharmacist[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;