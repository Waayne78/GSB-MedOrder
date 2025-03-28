const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST, // localhost
  user: process.env.DB_USER, // root
  password: process.env.DB_PASSWORD, // vide pour XAMPP par défaut
  database: process.env.DB_NAME, // gsb_database ou ton nom de base
  port: process.env.DB_PORT, // 3307 pour XAMPP
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
