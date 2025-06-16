const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Route SANS authentification ni vérification admin
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, email, firstname, lastname, role, created_at FROM users"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;