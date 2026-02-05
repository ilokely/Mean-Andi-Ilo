const express = require('express');
const router = express.Router();
const Image = require('../models/ImageProduit');

router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/' , async (req ,res) => {
     try {
        const newImage = new Image(req.body);
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router ;