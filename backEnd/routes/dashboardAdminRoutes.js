const express = require('express');
const router = express.Router();
const Box = require('../models/Box');
const Abonnement = require('../models/Abonnement');

router.get('/available/count', async (req, res) => {
    try {
        const count = await Box.countDocuments({ isAvailable: true });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Erreur lors du comptage des box disponibles:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/unavailable/count', async (req, res) => {
    try {
        const count = await Box.countDocuments({ isAvailable: false });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Erreur lors du comptage des box indisponibles:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/count/actifs', async (req, res) => {
    try {
        const count = await Abonnement.countDocuments({ statut: 'En cours' });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/count/termines', async (req, res) => {
    try {
        const count = await Abonnement.countDocuments({ statut: 'Terminé' });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/ca/mois', async (req, res) => {
    try {

        const abonnements = await Abonnement.find();

        let totalRevenue = 0;
        let totalMois = 0;

        abonnements.forEach(abo => {

            const duree =
                (abo.dateFin.getFullYear() - abo.dateDebut.getFullYear()) * 12 +
                (abo.dateFin.getMonth() - abo.dateDebut.getMonth()) + 1;

            totalRevenue += abo.prix * duree; // ⭐ prix mensuel × durée
            totalMois += duree;

        });

        const moyenne = totalMois === 0
            ? 0
            : parseFloat((totalRevenue / totalMois).toFixed(2));

        res.json({
            moyenneMensuelle: moyenne
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/stat/caMensuel', async (req, res) => {
    try {

        const abonnements = await Abonnement.find();

        let caParMois = {};

        abonnements.forEach(abo => {

            if (!abo.dateDebut || !abo.dateFin) return;

            let currentDate = new Date(abo.dateDebut);
            const endDate = new Date(abo.dateFin);

            while (currentDate <= endDate) {

                const key =
                    currentDate.getFullYear() + "-" +
                    String(currentDate.getMonth() + 1).padStart(2, '0');

                if (!caParMois[key]) caParMois[key] = 0;

                caParMois[key] += abo.prix; // prix mensuel

                currentDate.setMonth(currentDate.getMonth() + 1);
            }

        });

        // Transformer en tableau trié
        const result = Object.keys(caParMois)
            .sort()
            .map(mois => ({
                mois,
                total: caParMois[mois]
            }));

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/stat/typePlusUtilise', async (req, res) => {
    try {

        const stats = await Abonnement.aggregate([
            {
                $lookup: {
                    from: "typeAbonnement",
                    localField: "typeAbonnement",
                    foreignField: "_id",
                    as: "typeInfo"
                }
            },
            { $unwind: "$typeInfo" },

            {
                $group: {
                    _id: "$typeInfo.type",
                    total: { $sum: 1 }
                }
            },

            { $sort: { total: -1 } }

        ]);

        res.json(stats);

    } catch (error) {
        res.
            status(500).json({ message: error.message });
    }
});

module.exports = router;