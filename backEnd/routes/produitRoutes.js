const express = require('express');
const router = express.Router();
const Boutique = require('../models/Utilisateur'); // Boutique is a user
const CategorieProduit = require('../models/CategorieProduit');
const Image = require('../models/ImageProduit');
const Produit = require('../models/Produit');
const EntreeProduit = require('../models/EntreeProduit');
const SortieProduit = require('../models/SortieProduit');

router.get('/getProduits', async (req, res) => {   
    try {
        const produits = await Produit.find();
        res.json(produits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getEntreeProduits', async(req,res) => {
    try{
        const entreeProduits = await EntreeProduit.find();
        res.json(entreeProduits);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/getSortieProduits', async(req,res) => {
    try{
        const sortieProduits = await SortieProduit.find();
        res.json(sortieProduits);
    }
    catch(error){ 
        res.status(500).json({message: error.message});
    }
});

router.post('/addProduit', async (req, res) => {
    try {
        const {
            boutiqueId,
            categorieId,
            imageId,
            nom,
            marque,
            description,
            prix,
            devise,
            quantiteInitiale,
            prixAchat
        } = req.body;

        const boutique = await Boutique.findById(boutiqueId);
        const categorie = await CategorieProduit.findById(categorieId);
        // const image = await Image.findById(imageId);

        // if (!mongoose.Types.ObjectId.isValid(boutiqueId)) {
        //     return res.status(400).json({ error: 'ID boutique invalide' });
        // }

        if (!boutique || !categorie) {
            return res.status(404).json({ error: 'Ressource non trouvée' });
        }

        let image = null;
        if(imageId){
            image = await Image.findById(imageId);
            if(!image){
                return res.status(404).json({ error: 'Image non trouvée' });
            }
        }

        const nouveauProduit = await Produit.create({
            boutique: {
                id: boutique._id,
                nomUtilisateur: boutique.nomUtilisateur
            },
            nom,
            marque,
            description,
            prix,
            devise,
            categorieProduit: {
                id: categorie._id,
                libelle: categorie.libelle
            },
            ...(image && {
                imageProduit: {
                    id: image._id,
                    path: image.path
                }
            })
        });

        const entreeStock = await EntreeProduit.create({
            produit: {
                id: nouveauProduit._id,
                nom: nouveauProduit.nom
            },
            boutique: {
                id: boutique._id,
                nomUtilisateur: boutique.nomUtilisateur
            },
            quantite: quantiteInitiale,
            prixAchat: prixAchat,
            date: new Date()
        });

        res.status(201).json({
            message: 'Produit créé avec succès et inséré dans le stock',
            produit: nouveauProduit,
            stockInitial: entreeStock
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
