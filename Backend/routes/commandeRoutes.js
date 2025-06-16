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
  console.log("Corps complet de la requête:", req.body);
  const { items, total, date, userId, praticienId } = req.body;

  console.log("Type de userId:", typeof userId);
  console.log("Valeur de userId:", userId);

  try {
    await db.query("SET FOREIGN_KEY_CHECKS=0");

    const [users] = await db.query("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    console.log("Utilisateurs trouvés:", users);

    if (users.length === 0) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const userIdAsNumber = parseInt(userId, 10);
    console.log("userId original:", userId, "Type:", typeof userId);
    console.log(
      "userId converti:",
      userIdAsNumber,
      "Type:",
      typeof userIdAsNumber
    );

    const praticienIdValue = 1; // Toujours 1

    // Insérer la commande SANS praticien_id
    const [result] = await db.query(
      "INSERT INTO commandes (pharmacien_id, praticien_id, statut, date_commande, montant_total) VALUES (?, ?, ?, ?, ?)",
      [userIdAsNumber, praticienIdValue, "En attente", date, total]
    );

    const commandeId = result.insertId;
    console.log("Commande insérée avec ID:", commandeId);
    console.log("pharmacien_id utilisé:", userIdAsNumber);

    // Vérification immédiate
    const [verification] = await db.query(
      "SELECT * FROM commandes WHERE id = ?",
      [commandeId]
    );
    console.log("Commande vérifiée après insertion:", verification[0]);

    // Insérer les détails de la commande
    for (const item of items) {
      console.log("Ajout détail commande :", {
        commandeId,
        medicament_id: item.id,
        quantite: item.quantity,
        prix_unitaire: item.price,
        item,
      });
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
    await db.query("UPDATE commandes SET statut = ? WHERE id = ?", [
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
