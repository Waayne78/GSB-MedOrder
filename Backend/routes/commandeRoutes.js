const express = require("express");
const router = express.Router();
const db = require("../config/db");
const orderController = require("../controllers/commandeController"); // Assurez-vous que cette ligne est correcte


// Route de test simple
router.get("/test", (req, res) => {
  res.json({ message: "Route de test fonctionnelle" });
});

// Obtenir toutes les commandes
router.get("/commandes", async (req, res) => {
  try {
    const [commandes] = await db.query("SELECT * FROM commandes");
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour créer une nouvelle commande
router.post("/commandes", async (req, res) => {
  const { items, total, date } = req.body;
  
  try {
    // Désactiver temporairement les vérifications de clés étrangères
    await db.query("SET FOREIGN_KEY_CHECKS=0");
    
    // Récupérer un ID utilisateur valide
    const [users] = await db.query("SELECT id FROM users LIMIT 1");
    if (users.length === 0) {
      await db.query("SET FOREIGN_KEY_CHECKS=1"); // Réactiver les vérifications
      return res.status(400).json({ message: "Aucun utilisateur trouvé" });
    }
    
    const userId = users[0].id;
    
    // Insérer la commande avec l'ID utilisateur
    const [result] = await db.query(
      "INSERT INTO commandes (pharmacien_id, praticien_id, status, date_commande, montant_total) VALUES (?, ?, ?, ?, ?)",
      [userId, userId, "En attente", date, total]
    );

    const commandeId = result.insertId;

    // Insérer les détails de la commande
    for (const item of items) {
      await db.query(
        "INSERT INTO commande_details (commande_id, medicament_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)",
        [commandeId, item.id, item.quantity, item.price]
      );
    }
    
    // Réactiver les vérifications de clés étrangères
    await db.query("SET FOREIGN_KEY_CHECKS=1");

    res.status(201).json({
      message: "Commande créée avec succès",
      commandeId: commandeId,
    });
  } catch (error) {
    // Toujours réactiver les vérifications en cas d'erreur
    await db.query("SET FOREIGN_KEY_CHECKS=1");
    console.error("Erreur lors de la création de la commande:", error);
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour une commande
router.put("/commandes/:id", async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  try {
    await db.query("UPDATE commandes SET status = ? WHERE id = ?", [
      statut,
      id,
    ]);
    res.json({ message: "Commande mise à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:userId", orderController.getUserOrders);

module.exports = router;
