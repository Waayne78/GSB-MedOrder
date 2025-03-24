const db = require('../config/db');

// Créer un stock
exports.createStock = async (req, res) => {
  const { medicament_id, quantite, date_reapprovisionnement } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO Stocks (medicament_id, quantite, date_reapprovisionnement) VALUES (?, ?, ?)',
      [medicament_id, quantite, date_reapprovisionnement]
    );
    res.status(201).json({ id: result.insertId, medicament_id, quantite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les stocks
exports.getStocks = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Stocks');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un stock par ID
exports.getStockById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM Stocks WHERE stock_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Stock non trouvé' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};