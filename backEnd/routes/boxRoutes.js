const express = require('express');
const router = express.Router();
const Box = require('../models/Box');

router.get('/', async (req, res) => {
    try {
        const allbox = await Box.find();
        res.json(allbox);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newbox = new Box(req.body);
        await newbox.save();
        res.status(201).json(newbox);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;


