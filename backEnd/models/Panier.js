const mongoose = require('mongoose');

const PanierSchema = new mongoose.Schema({
    utilisateur: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        nomUtilisateur: { type: String, required: true }
    },
    produits: [{
        produit: {
            id: { type: mongoose.Schema.Types.ObjectId, required: true },
            nom: { type: String, required: true }
        },
        quantite: { type: Number, required: true },
        prix: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Panier', PanierSchema, 'panier');
