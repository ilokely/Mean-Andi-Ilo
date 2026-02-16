const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');

//getAllUsers except Admins
router.get('/notAdmin', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find({
            role: { $ne: 'Admin' }
        });
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//getAllBoutique
router.get('/boutique', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find({
             'role.libelle': 'Boutique'
        });
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//getAllClient
router.get('/client', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find({
            'role.libelle': 'Client'
        });
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/' , async(req,res)=> {
    try {
        const utilisateurs = await Utilisateur.find();
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/boutique', async (req, res) => {
  try {
    const { nomUtilisateur, email, numero, motDePasse } = req.body;

    const exist = await Utilisateur.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const bcrypt = require('bcrypt');  // pour Node.js CommonJS
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const nouvelUtilisateur = new Utilisateur({
      role: {
        id: '697b267ae1026e1be6bb16b2',
        libelle: 'Boutique'
      },
      nomUtilisateur,
      email,
      numero,
      motDePasse: hashedPassword
    });

    await nouvelUtilisateur.save();

    res.status(201).json( nouvelUtilisateur );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//Connexion
router.post('/login', async (req, res) => {
    const { email, motDePasse } = req.body;
    const user = await Utilisateur.findOne({ email });
    if (!user || !(motDePasse == user.motDePasse)) {
      return res.status(401).json({ error: "Email ou mot de passe invalide" });
    }
    res.json({user});
});

//getUserById
router.get('/:id', async (req, res) => {
    try {
        const user = await Utilisateur.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//getUserRole
router.get('/:id/role', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(utilisateur.role.libelle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//update infos utilisateur
router.put('/updateUserInfo/:id' , async(req,res)=> {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        utilisateur.nomUtilisateur = req.body.nomUtilisateur;
        utilisateur.email = req.body.email;
        utilisateur.numero = req.body.numero;
        await utilisateur.save();
        res.json(utilisateur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;