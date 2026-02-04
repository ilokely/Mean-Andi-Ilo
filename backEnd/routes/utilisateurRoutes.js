const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');

router.get('/' , async(req,res)=> {
    try {
        const utilisateurs = await Utilisateur.find();
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({message: error.message});
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
        const utilisateur = await Utilisateur.findById(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(utilisateur);
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
        res.json(utilisateur.role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;