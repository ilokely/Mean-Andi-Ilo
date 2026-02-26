const express = require('express');
const router = express.Router();
const Abonnement = require('../models/Abonnement');
const checkAbonnementExpiration = require('../middleware/checkAbonnementExpiration');

router.use(checkAbonnementExpiration);

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
        const abonnement = await Abonnement.findOne({ 
            'utilisateur': boutiqueId,
            'statut': 'En cours'  
        })
        .sort({ dateDebut: -1 }) 
        .populate('utilisateur')
        .populate('box')
        .populate('typeAbonnement');

        if (!abonnement) {
            abonnement = await Abonnement.findOne({ 
                'utilisateur': boutiqueId,
                'statut': 'Terminé'
            })
            .sort({ dateFin: -1 })
            .populate('utilisateur')
            .populate('box')
            .populate('typeAbonnement');
        }

        if (!abonnement) {
            console.log('Aucun abonnement actif trouvé');
            return res.status(404).json({ 
                message: 'Aucun abonnement actif trouvé pour cet utilisateur' 
            });
        }

        res.json(abonnement);
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

router.post('/reabonner', async (req, res) => {
    try {
        const { utilisateur, box, typeAbonnement, prix } = req.body;

        // Vérifications simples
        if (!utilisateur || !box || !typeAbonnement || !dateDebut || !prix) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
        }

        const prixFinal = box.prix - (box.prix * (typeAbonnement.reduction / 100));
        // Créer l’inscription
        const nouvelleAbo = new Abonnement({
            utilisateur,
            box,
            typeAbonnement,
            dateDebut: new Date(),
            prix: prixFinal,
            statut:'En cours'
        });

        await nouvelleAbo.save();

        console.log('Réabonnement créé:', nouvelleAbo._id, nouvelleAbo.dateDebut);


        res.status(201).json({ message: 'Réabonnement effectué avec succès', nouvelleAbo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});     

// router.post('/reabonner', async (req, res) => {
//     try {
//         const { utilisateurId, boxId, typeAbonnementId, prix } = req.body;

//         // Calculer les dates
//         const dateDebut = new Date();
//         // const dateFin = new Date();
//         // dateFin.setMonth(dateFin.getMonth() + dureeEnMois);

//         const nouvelAbonnement = await Abonnement.create({
//             utilisateur: utilisateurId,
//             box: boxId,
//             typeAbonnement: typeAbonnementId,
//             dateDebut,
//             // dateFin,
//             prix,
//             statut: 'En cours'
//         });

//         await nouvelAbonnement.populate('utilisateur');
//         await nouvelAbonnement.populate('box');
//         await nouvelAbonnement.populate('typeAbonnement');

//         console.log('✅ Réabonnement créé:', nouvelAbonnement._id);

//         res.status(201).json({
//             message: 'Réabonnement effectué avec succès',
//             abonnement: nouvelAbonnement
//         });

//     } catch (error) {
//         console.error('❌ Erreur réabonnement:', error);
//         res.status(500).json({ message: error.message });
//     }
// });

module.exports = router;