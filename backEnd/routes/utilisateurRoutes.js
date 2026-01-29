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

module.exports = router;