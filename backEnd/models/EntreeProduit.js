const mongoose = require('mongoose');

const EntreeProduitSchema = new mongoose.Schema({
    produit: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Produit' },
        nom: { type: String, required: true }
    },
    boutique: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Utilisateur' },
        nomUtilisateur: { type: String, required: true }
    },
    date: { type: Date, default: Date.now },
    quantite: { type: Number, required: true },
    prixAchat : { type: Number, required: true }, // UNITAIRE
    montantTotal: { type: Number },
}, { timestamps: true });

EntreeProduitSchema.pre('save', function() {
    if (this.prixAchat && this.quantite) {
        this.montantTotal = this.quantite * this.prixAchat;
    }
});

module.exports = mongoose.model('EntreeProduit', EntreeProduitSchema, 'entreeProduit');
