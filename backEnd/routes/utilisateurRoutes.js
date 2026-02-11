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
            'role.valeur': 20
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
            'role.valeur': 30
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

router.post('/', async(req,res) => {
    try{
        const newUtilisateur = new Utilisateur(req.body);
        await newUtilisateur.save();
        res.status(201).json(newUtilisateur);
    }
    catch(error){
        res.status(400).json({message: error.message});
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

module.exports = router;