const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
    panier: [{
        produit: {
            id: { type: mongoose.Schema.Types.ObjectId, required: true },
            nom: { type: String, required: true }
        },
        quantite: { type: Number, required: true },
        prix: { type: Number, required: true }
    }],
    dateCommande: { type: Date, default: Date.now },
    statut: { type: String, default: 'En attente' }
}, { timestamps: true });

module.exports = mongoose.model('Commande', CommandeSchema, 'commande');
