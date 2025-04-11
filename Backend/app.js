const express = require("express");
const cors = require("cors");
const path = require("path");
// Importez les routes une seule fois
const userRoutes = require("./routes/userRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const commandeRoutes = require("./routes/commandeRoutes");
const pharmacistRoutes = require("./routes/pharmacistRoutes");
const practitionerRoutes = require("./routes/practitionerRoutes");
const suiviCommandesRoutes = require("./routes/suiviCommandesRoutes");
const commandeDetailsRoutes = require("./routes/commandeDetailsRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json()); // Utilisez seulement express.json(), pas bodyParser

// Route racine
app.get("/", (req, res) => {
  res.json({ message: "API GSB MedOrder fonctionnelle" });
});

// Montez les routes - SUPPRIMEZ le bloc try/catch qui re-importe les routes
app.use("/api", medicationRoutes);
app.use("/api", practitionerRoutes);
app.use("/api", commandeRoutes);       // Important pour les commandes
app.use("/api", pharmacistRoutes);
app.use("/api", suiviCommandesRoutes);
app.use("/api", commandeDetailsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Fichiers statiques
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.stack);
  res.status(500).json({ message: "Une erreur est survenue !" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Erreur non capturée:", err);
});

// Ajoutez ce code avant app.listen pour déboguer les routes
console.log("Routes disponibles:");

// Middleware pour capturer toutes les requêtes et les journaliser
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Afficher les routes enregistrées
app._router.stack.forEach((layer) => {
  if (layer.route) {
    const path = layer.route.path;
    const methods = Object.keys(layer.route.methods).join(", ");
    console.log(`Route: ${methods.toUpperCase()} ${path}`);
  } else if (layer.name === "router") {
    layer.handle.stack.forEach((stackItem) => {
      if (stackItem.route) {
        const path = stackItem.route.path;
        const methods = Object.keys(stackItem.route.methods).join(", ");
        console.log(`Route: ${methods.toUpperCase()} ${path}`);
      }
    });
  }
});
