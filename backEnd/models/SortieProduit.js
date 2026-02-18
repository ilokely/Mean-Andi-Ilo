const mongoose = require('mongoose');

const SortieProduitSchema = new mongoose.Schema({
    produit: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Produit' },
        nom: { type: String, required: true },
        devise: { type: String, default: 'EUR'}
    },
    boutique: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Utilisateur' },
        nomUtilisateur: { type: String, required: true }
    },
    date: { type: Date, default: Date.now },
    quantiteVente: { type: Number, required: true },
    prixVente : { type: Number, required: true }, // UNITAIRE
    montantTotal: { type: Number },
}, { timestamps: true });

SortieProduitSchema.pre('save', function() {
    if (this.prixVente && this.quantiteVente) {
        this.montantTotal = this.quantiteVente * this.prixVente;
    }
});

SortieProduitSchema.post('save', async function(doc) {
    try {
        const Produit = mongoose.model('Produit');
        const produit = await Produit.findById(doc.produit.id);
        
        if (produit) {
            // Décrémentation simple
            produit.stockActuel -= doc.quantiteVente;
            produit.nombreVentes += doc.quantiteVente;
            await produit.updateStatut();
            
            console.log(`Stock mis à jour pour ${produit.nom}: ${produit.stockActuel}`);
        }
    } catch (error) {
        console.error('Erreur mise à jour stock:', error);
    }
});

SortieProduitSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        try {
            const Produit = mongoose.model('Produit');
            const produit = await Produit.findById(doc.produit.id);
            
            if (produit) {
                // Recalculer pour être sûr
                await produit.calculerStock();
                console.log(`Stock recalculé après suppression: ${produit.stockActuel}`);
            }
        } catch (error) {
            console.error('Erreur recalcul stock:', error);
        }
    }
});

module.exports = mongoose.model('SortieProduit', SortieProduitSchema, 'sortieProduit');
