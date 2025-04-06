const db = require("../config/db");

exports.createLigneCommande = async (req, res) => {
  const { commande_id, medicament_id, quantite, prix_unitaire_historique } =
    req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO LignesCommande (commande_id, medicament_id, quantite, prix_unitaire_historique) VALUES (?, ?, ?, ?)",
      [commande_id, medicament_id, quantite, prix_unitaire_historique]
    );
    res.status(201).json({ id: result.insertId, commande_id, medicament_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLignesCommande = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM LignesCommande");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLigneCommandeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM LignesCommande WHERE ligne_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Ligne de commande non trouvée" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
