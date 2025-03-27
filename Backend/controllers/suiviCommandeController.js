const db = require('../models/db');

// Ajouter un suivi à une commande
exports.addSuiviCommande = (req, res) => {
    const { commande_id, status } = req.body;
    db.query(
        'INSERT INTO suivi_commandes (commande_id, status) VALUES (?, ?)',
        [commande_id, status],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur du serveur', error: err });
            }
            res.status(201).json({ message: 'Suivi ajouté', id: results.insertId });
        }
    );
};

// Récupérer le suivi d'une commande
exports.getSuiviCommande = (req, res) => {
    const { commande_id } = req.params;
    db.query('SELECT * FROM suivi_commandes WHERE commande_id = ?', [commande_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur du serveur', error: err });
        }
        res.json(results);
    });
};
