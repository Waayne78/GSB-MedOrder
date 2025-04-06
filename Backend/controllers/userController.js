const db = require("../config/db");

exports.createUser = async (req, res) => {
  const { nom, email, mot_de_passe, adresse, role } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO Utilisateurs (nom, email, mot_de_passe, adresse, role) VALUES (?, ?, ?, ?, ?)",
      [nom, email, mot_de_passe, adresse, role]
    );
    res.status(201).json({ id: result.insertId, nom, email, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Utilisateurs");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM Utilisateurs WHERE user_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
