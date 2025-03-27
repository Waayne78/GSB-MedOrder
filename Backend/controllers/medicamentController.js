const db = require('../models/db');

// Récupérer tous les médicaments
exports.getAllMedicaments = (req, res) => {
    db.query('SELECT * FROM medications', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur du serveur', error: err });
        }
        res.json(results);
    });
};

// Ajouter un médicament
exports.addMedicament = (req, res) => {
    const { nom, description, prix } = req.body;
    db.query(
        'INSERT INTO medications (nom, description, prix) VALUES (?, ?, ?)',
        [nom, description, prix],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur du serveur', error: err });
            }
            res.status(201).json({ message: 'Médicament ajouté', id: results.insertId });
        }
    );
};

// Mettre à jour un médicament
exports.updateMedicament = (req, res) => {
    const { id } = req.params;
    const { nom, description, prix } = req.body;
    db.query(
        'UPDATE medications SET nom = ?, description = ?, prix = ? WHERE id = ?',
        [nom, description, prix, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur du serveur', error: err });
            }
            res.json({ message: 'Médicament mis à jour' });
        }
    );
};
