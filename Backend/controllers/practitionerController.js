const db = require('../models/db'); // Assure-toi que le bon chemin est utilisé pour le fichier db.js

// Récupérer tous les praticiens
exports.getAllPractitioners = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM practitioners');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur', error: err });
  }
};

// Créer un praticien
exports.createPractitioner = async (req, res) => {
  const { nom, email } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO practitioners (nom, email) VALUES (?, ?)`,
      [nom, email]
    );
    res.status(201).json({ message: 'Praticien créé', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur', error: err });
  }
};
