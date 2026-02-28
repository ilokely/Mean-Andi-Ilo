const express = require('express');
const router = express.Router();
const CategorieProduit = require('../models/CategorieProduit');
const Produit = require('../models/Produit');

router.get('/getCategories', async (req, res) => {
    try {
        const categories = await CategorieProduit.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/addCategorie' , async (req ,res) => {
     try {
        const newCategorie = new CategorieProduit(req.body);
        await newCategorie.save();
        res.status(201).json(newCategorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/updateCategorie/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { libelle } = req.body;

        console.log('Mise à jour catégorie:', { id, libelle });

        if (!libelle || libelle.trim() === '') {
            return res.status(400).json({ message: 'Le libellé est requis' });
        }

        const categorie = await CategorieProduit.findByIdAndUpdate(
            id,
            { libelle: libelle.trim() },
            { new: true, runValidators: true }
        );

        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        console.log('Catégorie mise à jour:', categorie);

        const updateResult = await Produit.updateMany(
            { 'categorieProduit.id': id },
            { 
                $set: { 
                    'categorieProduit.libelle': libelle.trim() 
                } 
            }
        );

        console.log(`${updateResult.modifiedCount} produit(s) mis à jour`);

        res.status(200).json({
            message: 'Catégorie modifiée avec succès',
            categorie,  // Retourner l'objet complet
            produitsModifies: updateResult.modifiedCount
        });

    } catch (error) {
        console.error('Erreur mise à jour:', error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/deleteCategorie/:id', async(req,res) => {
    try{
        const categorieId = req.params.id;
        const categorie = await CategorieProduit.findByIdAndDelete(categorieId);
        if(!categorie){
            return res.status(404).json({error:'Categorie introuvable'});
        }
        res.status(200).json({
            message: 'Categorie supprimée avec succès',
            categorie: categorie
        });
    }
    catch(error){
        console.error('Erreur suppression categorie:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router ;