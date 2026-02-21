const express = require('express');
const router = express.Router();
const EntreeProduit = require('../models/EntreeProduit');
const Boutique = require('../models/Utilisateur');
const Produit = require('../models/Produit');

router.get('/getEntreeProduits', async(req,res) => {
    try{
        const entreeProduits = await EntreeProduit.find();
        res.json(entreeProduits);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/getStockByBoutique/:boutiqueId', async(req,res) => {
    try{
        const entreeProduit = await EntreeProduit.find({ 'boutique.id': req.params.boutiqueId }).sort({ date: -1});
        res.json(entreeProduit);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

router.post('/addEntreeProduit', async(req,res) => {
    try{
        const {
            produitId,
            boutiqueId,
            quantite,
            prixAchat
        } = req.body;
       
        const boutique = await Boutique.findById(boutiqueId);
        const produit = await Produit.findById(produitId);

        if(!boutique || !produit){
            return res.status(404).json({ error: 'Ressource non trouvée' });
        }

        const nouvelleEntree = await EntreeProduit.create({
            produit: {
                id: produit._id,
                nom: produit.nom,
                devise: produit.devise
            },
            boutique: {
                id: boutique._id,
                nomUtilisateur: boutique.nomUtilisateur
            },
            quantite: quantite,
            prixAchat: prixAchat,
            date: new Date()
        });

        res.status(201).json({
            message: 'Entree de produit créée avec succès',
            entree: nouvelleEntree
        });
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});
module.exports = router;
