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

router.put('/:id', async (req, res) => {
    try {
        const updatedType = await TypeAbonnement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedType) return res.status(404).json({ message: 'Type d\'abonnement non trouvé' });
        res.json(updatedType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedType = await TypeAbonnement.findByIdAndDelete(req.params.id);
        if (!deletedType) return res.status(404).json({ message: 'Type d\'abonnement non trouvé' });
        res.json({ message: 'Type d\'abonnement supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;