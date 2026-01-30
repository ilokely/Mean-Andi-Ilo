const express = require('express');
const router = express.Router();
const TypeAbonnement = require('../models/TypeAbonnement');

router.get('/', async (req , res) => {
    try {
        const typesAbo = await TypeAbonnement.find();
        res.json(typesAbo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const newType = new TypeAbonnement(req.body);
        await newType.save();
        res.status(201).json(newType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;