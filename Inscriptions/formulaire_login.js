const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Module pour comparer les mots de passe hachés
const { pool, poolConnect } = require('./db'); // Connexion SQL Server via pool

// Route POST pour la connexion utilisateur
router.post('/', async (req, res) => {
  const { email, mot_de_passe } = req.body; // Récupération des données envoyées par le client

  // Vérification que les champs ne sont pas vides
  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    await poolConnect; // S'assurer que la connexion à la base est prête

    // Requête SQL pour chercher un utilisateur avec l'email fourni
    const result = await pool.request()
      .input('email', email)
      .query('SELECT * FROM Utilisateur WHERE email = @email');

    // Si aucun utilisateur n'est trouvé
    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'Email introuvable' });
    }

    const utilisateur = result.recordset[0]; // Récupération de l'utilisateur trouvé
    const hash_bdd = utilisateur.mot_de_passe; // Mot de passe haché stocké en BDD

    // Comparaison entre le mot de passe fourni et le hash stocké
    const match = await bcrypt.compare(mot_de_passe, hash_bdd);

    // Si le mot de passe ne correspond pas
    if (!match) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Si le mot de passe est bon → connexion réussie
    res.status(200).json({
      message: 'Connexion réussie !',
      utilisateur: {
        id: utilisateur.id_utilisateur,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
        type: utilisateur.type
      }
    });

  } catch (err) {
    // Gestion des erreurs côté serveur (ex : erreur SQL)
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Export du routeur pour l'utiliser dans server.js
module.exports = router;
