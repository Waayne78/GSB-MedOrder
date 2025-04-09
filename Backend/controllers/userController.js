const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;
  try {
    // Hachez le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, hashedPassword, role || "pharmacien"] // Par défaut, le rôle est 'visiteur'
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        firstname,
        lastname,
        email,
        role: role || "pharmacien",
      });
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

exports.registerUser = async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  try {
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const [existingUsers] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (email, password, firstname, lastname, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [email, hashedPassword, firstname, lastname, "visiteur"]
    );

    res.status(201).json({
      id: result.insertId,
      email,
      firstname,
      lastname,
      role: "visiteur",
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifiez si l'utilisateur existe
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const user = rows[0];

    // Vérifiez le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    // Retourner le token et les informations utilisateur
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
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
