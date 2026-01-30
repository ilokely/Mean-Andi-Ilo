const express = require('express');
const router = express.Router();
const Panier = require('../models/Panier');

router.get('/', async (req, res) => {
    try {
        const paniers = await Panier.find();
        res.json(paniers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newPanier = new Panier(req.body);
        await newPanier.save();
        res.status(201).json(newPanier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;