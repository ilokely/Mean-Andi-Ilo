const express = require('express');
const router = express.Router();
const SortieProduit = require('../models/SortieProduit');

router.get('/getSortieProduits', async(req,res) => {
    try{
        const sortieProduits = await SortieProduit.find();
        res.json(sortieProduits);
    }
    catch(error){ 
        res.status(500).json({message: error.message});
    }
});

module.exports = router;