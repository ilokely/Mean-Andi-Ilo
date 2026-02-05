const mongoose = require('mongoose');

const SortieProduitSchema = new mongoose.Schema({
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
    prixVente : { type: Number, required: true }, // UNITAIRE
    montantTotal: { type: Number },
}, { timestamps: true });

SortieProduitSchema.pre('save', function(next) {
    if (this.prixVente && this.quantite) {
        this.montantTotal = this.quantite * this.prixVente;
    }
    next(); 
});

module.exports = mongoose.model('SortieProduit', SortieProduitSchema, 'sortieProduit');
