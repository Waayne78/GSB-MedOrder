const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Routes pour les utilisateurs
router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);

module.exports = router;