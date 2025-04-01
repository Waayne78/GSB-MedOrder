const express = require("express");
const ligneCommandeController = require("../controllers/ligneCommandeController");

const router = express.Router();

router.post("/lignes-commande", ligneCommandeController.createLigneCommande);
router.get("/lignes-commande", ligneCommandeController.getLignesCommande);
router.get(
  "/lignes-commande/:id",
  ligneCommandeController.getLigneCommandeById
);

module.exports = router;
