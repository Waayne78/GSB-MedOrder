const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Route de test
router.get("/users", async (req, res) => {
  try {
    // Adapter cette requête en fonction de votre structure de base de données
    // Si vous n'avez pas de table users, vous pouvez simplement renvoyer un message
    res.json({ message: "API utilisateurs fonctionnelle" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route de connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Tentative de connexion pour:", email);

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      console.log("Utilisateur non trouvé:", email);
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log("Mot de passe invalide pour:", email);
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    console.log("Connexion réussie pour:", email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/register", userController.createUser);

module.exports = router;
