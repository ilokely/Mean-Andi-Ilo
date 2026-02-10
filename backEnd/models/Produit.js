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
    stockActuel: { type: Number, default: 0 },
    stockMinimum: { type: Number, default: 5 },
    statut: {
        type: String,
        enum: ['disponible', 'rupture', 'stock_bas', 'indisponible'],
        default: 'disponible'
    },
    nombreVentes: { type: Number, default: 0 },
}, { timestamps: true });

ProduitSchema.methods.updateStatut = async function() {
    if (this.stockActuel === 0) {
        this.statut = 'rupture';
    } else if (this.stockActuel <= this.stockMinimum) {
        this.statut = 'stock_bas';
    } else {
        this.statut = 'disponible';
    }
    await this.save();
};

ProduitSchema.methods.calculerStock = async function() {
    const EntreeProduit = mongoose.model('EntreeProduit');
    const SortieProduit = mongoose.model('SortieProduit');
    
    const [entrees, sorties] = await Promise.all([
        EntreeProduit.aggregate([
            { $match: { 'produit.id': this._id } },
            { $group: { _id: null, total: { $sum: '$quantite' } } }
        ]),
        SortieProduit.aggregate([
            { $match: { 'produit.id': this._id } },
            { $group: { _id: null, total: { $sum: '$quantite' } } }
        ])
    ]);
    
    const totalEntrees = entrees[0]?.total || 0;
    const totalSorties = sorties[0]?.total || 0;
    
    this.stockActuel = totalEntrees - totalSorties;
    await this.updateStatut();
    
    return this.stockActuel;
};

module.exports = mongoose.model('Produit', ProduitSchema, 'produit');
