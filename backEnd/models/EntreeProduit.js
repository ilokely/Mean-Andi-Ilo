const mongoose = require('mongoose');

const EntreeProduitSchema = new mongoose.Schema({
    produit: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        nom: { type: String, required: true }
    },
    date: { type: Date, default: Date.now },
    quantite: { type: Number, required: true },
    prix: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('EntreeProduit', EntreeProduitSchema, 'entreeProduit');
