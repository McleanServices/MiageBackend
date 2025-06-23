//Inscriptions
const sql = require('mssql');
const express = require('express');
const { connectDB } = require('./db');


const app = express();
const PORT = process.env.PORT || 3000;


connectDB();




// Configuration via .env
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT || '1433'),
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};




app.get('/', (req, res) => {
  res.send('API en ligne');
});


// Création du pool global
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect(); // Lancer la connexion au démarrage




// Route GET /api/utilisateurs
app.get('/api/utilisateurs', async (req, res) => {
    try {
        await poolConnect; // s'assurer que le pool est bien connecté


        const result = await pool.request()
            .query('SELECT * FROM Utilisateur');


        res.json(result.recordset);
    } catch (err) {
        console.error('Erreur lors de la requête SQL :', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});


app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
