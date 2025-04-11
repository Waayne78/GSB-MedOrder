const db = require("../config/db");

exports.createCommande = async (req, res) => {
  const { user_id, statut, montant_total } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO Commandes (user_id, statut, montant_total) VALUES (?, ?, ?)",
      [user_id, statut, montant_total]
    );
    res.status(201).json({ id: result.insertId, user_id, statut });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommandes = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Commandes");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommandeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM Commandes WHERE commande_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [orders] = await db.query(
      "SELECT * FROM commandes WHERE pharmacien_id = ? OR praticien_id = ?",
      [userId, userId]
    );
    
    // Vous pouvez optionnellement ajouter une vérification si aucune commande n'est trouvée
    if (orders.length === 0) {
      return res.status(200).json([]); // Renvoyer un tableau vide plutôt qu'une erreur 404
    }
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    res.status(500).json({ message: error.message });
  }
};