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
};


async function connectDB() {
  try {
  await sql.connect(config);
  console.log('Connexion à SQL Server réussie');
  } catch (err) {
  console.error('Erreur de connexion à la base de données :', err);
  }
}


module.exports = { sql, connectDB };
