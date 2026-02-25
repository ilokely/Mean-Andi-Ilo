const express = require('express');
const router = express.Router();
const Abonnement = require('../models/Abonnement');

router.get('/', async (req, res) => {
    try {
        const abonnements = await Abonnement.find()
            .populate('utilisateur')       // récupère toutes les infos de l'utilisateur
            .populate('box')               // récupère toutes les infos de la box
            .populate('typeAbonnement');   // récupère toutes les infos du type d'abonnement

        res.json(abonnements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getAbonnementByBoutique/:boutiqueId', async (req, res) => {
    try {
        const boutiqueId = req.params.boutiqueId;
        const abonnementsByBoutique = await Abonnement.find({ 'utilisateur.id': boutiqueId }).sort({ dateDebut: -1 });
        res.json(abonnementsByBoutique);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/add', async (req, res) => {
    try {
        const { utilisateur, box, typeAbonnement, dateDebut, prix } = req.body;

        // Vérifications simples
        if (!utilisateur || !box || !typeAbonnement || !dateDebut || !prix) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
        }

        // Créer l’inscription
        const nouvelleAbo = new Abonnement({
            utilisateur,
            box,
            typeAbonnement,
            dateDebut,
            prix,
            statut:'En cours'
        });

        await nouvelleAbo.save();

        res.status(201).json(nouvelleAbo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;