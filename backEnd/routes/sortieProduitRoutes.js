const express = require('express');
const router = express.Router();
const SortieProduit = require('../models/SortieProduit');
const Boutique = require("../models/Utilisateur")
const Produit = require("../models/Produit")

router.get('/getAllSortieProduits', async(req,res) => {
    try{
        const sortieProduits = await SortieProduit.find();
        res.json(sortieProduits);
    }
    catch(error){ 
        res.status(500).json({message: error.message});
    }
});

router.get('/getSortieProduitByBoutique/:boutiqueId', async(req,res) => {
    try{
        const boutiqueId = req.params.boutiqueId;
        const sortieProduitByBoutique = await SortieProduit.find({ 'boutique.id': boutiqueId }).sort({ date: -1 });
        res.json(sortieProduitByBoutique);
    }
    catch(error){
        res.status(500).json({ message : error.message });
    }
})

router.post('/addSortieProduit', async(req,res) => {
    try{
        const {
            produitId,
            boutiqueId,
            quantiteVente
        } = req.body;

        const boutique = await Boutique.findById(boutiqueId);
        const produit = await Produit.findById(produitId);

        if(!boutique || !produit){
            return res.status(404).json({ error: 'Ressource non trouvée' });
        }

        if (produit.stockActuel < quantiteVente) {
            return res.status(400).json({ 
                error: `Stock insuffisant pour le produit ${produit.nom}.` 
            });
        }
        const nouvelleSortie = await SortieProduit.create({
            produit: {
                id: produit._id,
                nom: produit.nom,
                devise: produit.devise
            },
            boutique: {
                id: boutique._id,
                nomUtilisateur: boutique.nomUtilisateur
            },
            quantiteVente: quantiteVente,
            prixVente: produit.prixVente,
            date: new Date()
        });

        res.status(201).json({
            message: 'Sortie de produit créée avec succès',
            sortie: nouvelleSortie
        });

    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;