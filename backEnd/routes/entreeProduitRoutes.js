const express = require('express');
const router = express.Router();
const EntreeProduit = require('../models/EntreeProduit');

router.get('/getEntreeProduits', async(req,res) => {
    try{
        const entreeProduits = await EntreeProduit.find();
        res.json(entreeProduits);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
