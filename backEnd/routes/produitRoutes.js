const express = require('express');
const router = express.Router();
const Boutique = require('../models/Utilisateur'); // Boutique is a user
const CategorieProduit = require('../models/CategorieProduit');
const ImageProduit = require('../models/ImageProduit');
const Produit = require('../models/Produit');
const EntreeProduit = require('../models/EntreeProduit');
const SortieProduit = require('../models/SortieProduit');
const upload = require('../config/multer.config');

router.get('/getProduits', async (req, res) => {   
    try {
        const produits = await Produit.find().populate('imageProduit');
        res.json(produits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getProduitsByBoutique/:boutiqueId', async (req, res) => {
    try {
        const produits = await Produit.find({ 'boutique.id': req.params.boutiqueId });
        res.json(produits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/addProduit', upload.single('image'), async (req, res) => {
    try {
        const {
            boutiqueId,
            categorieId,
            nom,
            marque,
            description,
            prixAchat,
            prixVente,
            devise,
            quantiteInitiale
        } = req.body;

        const boutique = await Boutique.findById(boutiqueId);
        const categorie = await CategorieProduit.findById(categorieId);

        if (!boutique || !categorie) {
            return res.status(404).json({ error: 'Ressource non trouvée' });
        }

        let imageProduitData = null;
        if (req.file) {
            const imagePath = `/uploads/produits/${req.file.filename}`;
            
            const imageProduit = await ImageProduit.create({
                path: imagePath
            });

            imageProduitData = {
                id: imageProduit._id,
                path: imagePath
            };

            console.log('Image créée:', imageProduitData);
        }

        const nouveauProduit = await Produit.create({
            boutique: {
                id: boutique._id,
                nomUtilisateur: boutique.nomUtilisateur
            },
            nom,
            marque,
            description,
            prixAchat,
            prixVente,
            devise,
            categorieProduit: {
                id: categorie._id,
                libelle: categorie.libelle
            },
            imageProduit: imageProduitData
        });

        const entreeStock = await EntreeProduit.create({
            produit: {
                id: nouveauProduit._id,
                nom: nouveauProduit.nom,
                devise: nouveauProduit.devise
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
        console.error('Erreur création produit:', error);
        if (req.file) {
            const fs = require('fs');
            const filePath = req.file.path;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('Fichier supprimé après erreur');
            }
        }
        res.status(500).json({ error: error.message });
    }
});


router.put('/updateProduit/:id', async(req,res) => {
    try{
        const id = req.params.id;
        const {
            nom,
            categorieId,
            marque,
            description,
            prixVente,
            devise
        } = req.body;

        const produit = await Produit.findById(id);
        if(!produit){
            return res.status(404).json({error: 'Produit non trouvé'});
        }

        let categorie = null;
        if(categorieId && categorieId !== produit.categorieProduit.id.toString()) {
            categorie = await CategorieProduit.findById(categorieId);
            if(!categorie){
                return res.status(404).json({error: 'Catégorie non trouvée'});
            }
        }

        const updateData = {
            nom,
            marque,
            description,
            prixVente,
            devise
        };

        if(categorie){
            updateData['categorieProduit.id'] = categorie._id;
            updateData['categorieProduit.libelle'] = categorie.libelle;
        }

        const produitMisAJour = await Produit.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Produit mis à jour avec succès',
            produit: produitMisAJour
        });
    } catch (error) {
        console.error('Erreur mise à jour produit:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/deleteProduit/:id', async (req, res) => {
    try {
        const produit = await Produit.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Produit supprimé avec succès',
            produit: produit
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
