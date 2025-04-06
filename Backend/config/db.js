const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "gsb_database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connexion à la base de données MySQL réussie");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données MySQL:", error);
    return false;
  }
}

testConnection();

module.exports = pool;
