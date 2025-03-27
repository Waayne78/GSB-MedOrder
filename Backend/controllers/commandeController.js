const db = require('../models/db');

// Récupérer toutes les commandes
exports.getAllCommandes = (req, res) => {
    db.query('SELECT * FROM commandes', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur du serveur', error: err });
        }
        res.json(results);
    });
};

// Créer une nouvelle commande
exports.createCommande = (req, res) => {
    const { pharmacien_id, praticien_id, status } = req.body;
    db.query(
        'INSERT INTO commandes (pharmacien_id, praticien_id, status) VALUES (?, ?, ?)',
        [pharmacien_id, praticien_id, status],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur du serveur', error: err });
            }
            res.status(201).json({ message: 'Commande créée', id: results.insertId });
        }
    );
};

// Récupérer une commande par ID
exports.getCommandeById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM commandes WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur du serveur', error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.json(results[0]);
    });
};
