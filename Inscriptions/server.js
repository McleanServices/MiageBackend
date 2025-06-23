//Inscriptions

// === Importation des modules ===
const sql = require('mssql');// Module SQL Server
const express = require('express');// Framework Express
const bodyParser = require('body-parser');// Pour lire le JSON dans les requêtes
const inscriptionRoutes = require('./formulaire_inscription');// Les routes d'inscription (formulaire.js)
const { connectDB, pool, poolConnect } = require('./db');// Connexion à la BDD
const cors = require('cors'); // Pour autoriser les appels cross-origin (HTML local → API)
const loginRoutes = require('./formulaire_login');

// === Initialisation de l'application Express ===
const app = express();

// Définir le port d'écoute (par défaut 3000 si non défini dans .env)
app.use(cors());

const PORT = process.env.PORT || 3000;

// Middleware pour parser automatiquement le JSON reçu
app.use(bodyParser.json());

// Connexion à la base de données (affiche "Connexion réussie" ou erreur)
connectDB();

// Utilisation des routes d'inscription
// Toute requête vers /api/inscription passera par formulaire.js
app.use('/api/formulaire_inscription', inscriptionRoutes);

app.use('/api/formulaire_login', loginRoutes);

// Lancer le serveur sur le port défini
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});

// Route GET basique (vérification que l’API tourne bien)
app.get('/', (req, res) => {
  res.send('API en ligne');
});


// Route GET pour récupérer tous les utilisateurs depuis la table SQL
app.get('/api/utilisateurs', async (req, res) => {
    try {
        await poolConnect; // s'assurer que le pool est bien connecté

        // Exécuter la requête SQL
        const result = await pool.request()
            .query('SELECT * FROM Utilisateur');

        // Renvoyer les résultats sous forme JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('Erreur lors de la requête SQL :', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});


