const db = require('../config/db');

exports.createMedicament = async (req, res) => {
  const { nom, description, fabricant, prix_unitaire, date_expiration } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO Medicaments (nom, description, fabricant, prix_unitaire, date_expiration) VALUES (?, ?, ?, ?, ?)',
      [nom, description, fabricant, prix_unitaire, date_expiration]
    );
    res.status(201).json({ id: result.insertId, nom, fabricant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMedicaments = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Medicaments');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMedicamentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM Medicaments WHERE medicament_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Médicament non trouvé' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};