const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');
const mongoose = require('mongoose');
const SortieProduit = require('../models/SortieProduit');
const EntreeProduit = require('../models/EntreeProduit');

// GET - Statistiques du dashboard
router.get('/stats/:boutiqueId', async (req, res) => {
    try {
        const { boutiqueId } = req.params;

        // Chiffre d'affaires (somme des ventes)
        const ventesData = await SortieProduit.aggregate([
            { $match: { 'boutique.id': new mongoose.Types.ObjectId(boutiqueId) } },
            {
                $group: {
                    _id: null,
                    chiffreAffaires: { $sum: '$montantTotal' },
                    quantiteTotale: { $sum: '$quantiteVente' }
                }
            }
        ]);

        const chiffreAffaires = ventesData[0]?.chiffreAffaires || 0;

        // Coûts (somme des achats)
        const achatsData = await EntreeProduit.aggregate([
            { $match: { 'boutique.id': new mongoose.Types.ObjectId(boutiqueId) } },
            {
                $group: {
                    _id: null,
                    coutTotal: { $sum: '$montantTotal' }
                }
            }
        ]);

        const coutTotal = achatsData[0]?.coutTotal || 0;
        const benefices = chiffreAffaires - coutTotal;

        // Nombre de produits
        const nombreProduits = await Produit.countDocuments({
            'boutique.id': new mongoose.Types.ObjectId(boutiqueId)
        });

        // Stock total
        const stockData = await Produit.aggregate([
            { $match: { 'boutique.id': new mongoose.Types.ObjectId(boutiqueId) } },
            {
                $group: {
                    _id: null,
                    stockTotal: { $sum: '$stockActuel' }
                }
            }
        ]);

        const stockTotal = stockData[0]?.stockTotal || 0;

        // Produits en rupture/stock bas
        const produitsRupture = await Produit.countDocuments({
            'boutique.id': boutiqueId,
            statut: 'rupture'
        });

        const produitsStockBas = await Produit.countDocuments({
            'boutique.id': boutiqueId,
            statut: 'stock_bas'
        });

        // Ventes par jour (7 derniers jours)
        const dateDebut = new Date();
        dateDebut.setDate(dateDebut.getDate() - 7);

        const ventesParJour = await SortieProduit.aggregate([
            {
                $match: {
                    'boutique.id': new mongoose.Types.ObjectId(boutiqueId),
                    date: { $gte: dateDebut }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    montant: { $sum: '$montantTotal' },
                    quantite: { $sum: '$quantiteVente' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const ventesFormatted = ventesParJour.map(v => ({
            date: v._id,
            montant: v.montant,
            quantite: v.quantite
        }));

        // Top 5 produits
        const topProduits = await SortieProduit.aggregate([
            { $match: { 'boutique.id': new mongoose.Types.ObjectId(boutiqueId) } },
            {
                $group: {
                    _id: '$produit.nom',
                    ventes: { $sum: '$quantiteVente' },
                    montant: { $sum: '$montantTotal' }
                }
            },
            { $sort: { montant: -1 } },
            { $limit: 5 }
        ]);

        const topProduitsFormatted = topProduits.map(p => ({
            nom: p._id,
            ventes: p.ventes,
            montant: p.montant
        }));

        const evolutionCA = await SortieProduit.aggregate([
            { $match: { 'boutique.id': new mongoose.Types.ObjectId(boutiqueId) } },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    montant: { $sum: '$montantTotal' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);

        const evolutionFormatted = evolutionCA.map(e => ({
            mois: `${e._id.month}/${e._id.year}`,
            montant: e.montant
        }));

        // const response = {
        //     chiffreAffaires: ventesData[0]?.chiffreAffaires || 0,
        //     benefices: benefices || 0,
        //     nombreProduits,
        //     stockTotal: stockData[0]?.stockTotal || 0,
        //     produitsRupture,
        //     produitsStockBas,
            
        //     // Données de test si vides
        //     ventesParJour: ventesFormatted.length > 0 ? ventesFormatted : [
        //         { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], montant: 1200, quantite: 5 },
        //         { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], montant: 1800, quantite: 8 },
        //         { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], montant: 2100, quantite: 10 },
        //         { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], montant: 1500, quantite: 6 },
        //         { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], montant: 2500, quantite: 12 },
        //         { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], montant: 3000, quantite: 15 },
        //         { date: new Date().toISOString().split('T')[0], montant: 1700, quantite: 7 }
        //     ],
            
        //     topProduits: topProduitsFormatted.length > 0 ? topProduitsFormatted : [
        //         { nom: 'Produit exemple 1', ventes: 50, montant: 5000 },
        //         { nom: 'Produit exemple 2', ventes: 30, montant: 3000 },
        //         { nom: 'Produit exemple 3', ventes: 20, montant: 2000 },
        //         { nom: 'Produit exemple 4', ventes: 15, montant: 1500 },
        //         { nom: 'Produit exemple 5', ventes: 10, montant: 1000 }
        //     ],
            
        //     evolutionCA: evolutionFormatted.length > 0 ? evolutionFormatted : []
        // };

        // console.log(' Stats envoyées:', response);
        // res.status(200).json(response);

        res.json({
            chiffreAffaires,
            benefices,
            nombreProduits,
            stockTotal,
            produitsRupture,
            produitsStockBas,
            ventesParJour: ventesFormatted,
            topProduits: topProduitsFormatted,
            evolutionCA: evolutionFormatted
        });

    } catch (error) {
        console.error('Erreur stats dashboard:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;