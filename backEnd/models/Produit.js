const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
    boutique: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Utilisateur' },
        nomUtilisateur: { type: String, required: true }
    },
    categorieProduit: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        libelle: { type: String, required: true }
    },
    imageProduit: {
        id: { type: mongoose.Schema.Types.ObjectId },
        path: { type: String }
    },
    nom: { type: String, required: true },
    marque: {type: String },
    description: { type: String },
    prix: { type: Number, required: true },
    devise: {type: String, default: 'EUR' },
    statut: {
        type: String,
        enum: ['disponible', 'indisponible'],
        default: 'disponible'
    }
}, { timestamps: true });

module.exports = mongoose.model('Produit', ProduitSchema, 'produit');
