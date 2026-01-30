const express = require('express');
const router = express.Router();
const Produit = require ('../models/Produit');

router.get('/', async (req, res) => {
    try {
        const produits = await Produit.find();
        res.json(produits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduit = new Produit(req.body);
        await newProduit.save();
        res.status(201).json(newProduit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;