const db = require('../models/db');

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
    db.query('SELECT * FROM pharmacists UNION SELECT * FROM practitioners', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur du serveur', error: err });
        }
        res.json(results);
    });
};

// Créer un utilisateur
exports.createUser = (req, res) => {
    const { nom, email, role } = req.body; // role : 'pharmacien' ou 'praticien'
    const table = role === 'pharmacien' ? 'pharmacists' : 'practitioners';
    db.query(
        `INSERT INTO ${table} (nom, email) VALUES (?, ?)`,
        [nom, email],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur du serveur', error: err });
            }
            res.status(201).json({ message: 'Utilisateur créé', id: results.insertId });
        }
    );
};
