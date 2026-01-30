const express = require('express');
const router = express.Router();
const Commande = require('../models/Commande');

router.get('/', async (req, res) => {
    try {
        const commandes = await Commande.find();
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCommande = new Commande(req.body);
        await newCommande.save();
        res.status(201).json(newCommande);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;