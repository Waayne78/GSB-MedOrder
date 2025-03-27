const db = require('../models/db');

// Ajouter une ligne à la commande
exports.addLigneCommande = (req, res) => {
    const { commande_id, medicament_id, quantite, prix_unitaire } = req.body;
    db.query(
        'INSERT INTO commande_details (commande_id, medicament_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
        [commande_id, medicament_id, quantite, prix_unitaire],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur du serveur', error: err });
            }
            res.status(201).json({ message: 'Ligne de commande ajoutée', id: results.insertId });
        }
    );
};

// Récupérer les détails d'une commande
exports.getLignesCommande = (req, res) => {
    const { commande_id } = req.params;
    db.query('SELECT * FROM commande_details WHERE commande_id = ?', [commande_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur du serveur', error: err });
        }
        res.json(results);
    });
};
