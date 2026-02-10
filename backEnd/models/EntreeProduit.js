const mongoose = require('mongoose');

const EntreeProduitSchema = new mongoose.Schema({
    produit: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Produit' },
        nom: { type: String, required: true },
        devise: { type: String, default: 'EUR' },
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

EntreeProduitSchema.post('save', async function(doc) {
    try {
        const Produit = mongoose.model('Produit');
        const produit = await Produit.findById(doc.produit.id);
        
        if (produit) {
            // Recalculer le stock
            await produit.calculerStock();
            console.log(`Stock mis à jour pour ${produit.nom}: ${produit.stockActuel}`);
        }
    } catch (error) {
        console.error('Erreur mise à jour stock:', error);
    }
});

module.exports = mongoose.model('EntreeProduit', EntreeProduitSchema, 'entreeProduit');
