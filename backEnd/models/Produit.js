const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
    boutique: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        nomUtilisateur: { type: String, required: true }
    },
    nom: { type: String, required: true },
    description: { type: String },
    categorieProduit: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        libelle: { type: String, required: true }
    },
    imageProduit: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        path: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Produit', ProduitSchema, 'produit');
