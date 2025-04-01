const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route de test
router.get('/users', async (req, res) => {
    try {
        // Adapter cette requête en fonction de votre structure de base de données
        // Si vous n'avez pas de table users, vous pouvez simplement renvoyer un message
        res.json({ message: "API utilisateurs fonctionnelle" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Tentative de connexion pour:', email);
    
    // Rechercher l'utilisateur dans la base de données
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log('Utilisateur non trouvé:', email);
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    const user = users[0];
    
    // Vérifier le mot de passe
    // Note: dans votre base de données, les mots de passe sont stockés sous format $2b$10$...
    // Nous devons utiliser bcrypt.compare pour vérifier
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      console.log('Mot de passe invalide pour:', email);
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    console.log('Connexion réussie pour:', email);
    
    // Envoyer le token et les informations de l'utilisateur
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    
    // Vérifier si l'email existe déjà
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insérer le nouvel utilisateur
    const [result] = await pool.query(
      'INSERT INTO users (email, password, firstname, lastname, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [email, hashedPassword, firstname, lastname, 'visiteur']
    );
    
    // Générer un token JWT
    const token = jwt.sign(
      { id: result.insertId, email, role: 'visiteur' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    // Envoyer le token et les informations de l'utilisateur
    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        firstname,
        lastname,
        role: 'visiteur'
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;