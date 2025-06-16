const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateJWT = require("../middlewares/authenticateJWT"); // à adapter selon ton projet

function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Accès refusé" });
}

// Protéger la route avec authenticateJWT AVANT isAdmin
router.get("/users", authenticateJWT, isAdmin, async (req, res) => {
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