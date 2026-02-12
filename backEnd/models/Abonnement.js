const mongoose = require('mongoose');

const AbonnementSchema = new mongoose.Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',  
        required: true
    },
    box: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Box', 
        required: true
    },
    typeAbonnement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeAbonnement',  
        required: true
    },
    dateDebut: { type: Date, required: true },
    prix: { type: Number, required: true },
    statut: {
        type: String,
        enum: ['En cours', 'Terminé'],
        default: 'En cours'
    }
}, { timestamps: true });

module.exports = mongoose.model('Abonnement', AbonnementSchema, 'abonnement');                                                                                                                                                      