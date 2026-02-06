const express = require('express');
const router = express.Router();
const CategorieProduit = require('../models/CategorieProduit');

router.get('/getCategories', async (req, res) => {
    try {
        const categories = await CategorieProduit.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/' , async (req ,res) => {
     try {
        const newCategorie = new CategorieProduit(req.body);
        await newCategorie.save();
        res.status(201).json(newCategorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router ;