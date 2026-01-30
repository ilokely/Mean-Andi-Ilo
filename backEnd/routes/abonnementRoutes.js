const express = require('express');
const router = express.Router();
const Abonnement = require('../models/Abonnement');

router.get('/', async (req, res) => {
    try {
        const abonnements = await Abonnement.find();
        res.json(abonnements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newAbo = new Abonnement(req.body);
        await newAbo.save();
        res.status(201).json(newAbo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;