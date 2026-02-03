const express = require('express');
const router = express.Router();
const Box = require('../models/Box');

router.get('/', async (req, res) => {
    try {
        const allbox = await Box.find();
        res.json({ success: true, count: allbox.length, data: allbox});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newbox = new Box(req.body);
        await newbox.save();
        res.status(201).json({ success: true, data:newbox});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/available', async (req, res) => { 
    try { 
        const availableBox = await Box.find({ isAvailable: true });
        res.status(200).json({ success: true, count: availableBox.length, data: availableBox }); 
    } catch (error) { 
        console.error('Erreur lors de la récupération des box disponibles:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des box disponibles' });
    } 
});

router.get('/unAvailable', async (req, res) => { 
    try { 
        const unAvailableBoxes = await Box.find({ isAvailable: false });
        res.status(200).json({ success: true, count: unAvailableBoxes.length, data: unAvailableBoxes }); 
    } catch (error) { 
        console.error('Erreur lors de la récupération des box indisponibles:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des box indisponibles' });
    } 
});

module.exports = router;


