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
        res.status(200).json( availableBox ); 
    } catch (error) { 
        console.error('Erreur lors de la récupération des box disponibles:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des box disponibles' });
    } 
});

router.get('/unAvailable', async (req, res) => { 
    try { 
        const unAvailableBoxes = await Box.find({ isAvailable: false });
        res.status(200).json( unAvailableBoxes); 
    } catch (error) { 
        console.error('Erreur lors de la récupération des box indisponibles:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des box indisponibles' });
    } 
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBox = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBox) {
            return res.status(404).json({ message: 'Box non trouvé' });
        }
        res.json(updatedBox);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedBox = await Box.findByIdAndDelete(req.params.id);  
        if (!deletedBox) {
            return res.status(404).json({ message: 'Box non trouvé' });
        }
        res.json({ message: 'Box supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


