// db.js
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Créer un pool global
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

async function connectDB() {
  try {
    await poolConnect;
    console.log('✅ Connexion à SQL Server réussie');
  } catch (err) {
    console.error('❌ Erreur de connexion à la base de données :', err);
  }
}

module.exports = { sql, pool, poolConnect, connectDB };