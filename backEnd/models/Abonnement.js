const mongoose = require('mongoose');

const AbonnementSchema = new mongoose.Schema({
    utilisateur: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        nomUtilisateur: { type: String, required: true }
    },
    box: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        nom: { type: String, required: true }
    },
    typeAbonnement: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, required: true }
    },
    dateDebut: { type: Date, required: true },
    prix: { type: Number, required: true },
    statut: { type: String, default: 'En cours' }
}, { timestamps: true });

module.exports = mongoose.model('Abonnement', AbonnementSchema, 'abonnement');
