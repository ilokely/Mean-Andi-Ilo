const mongoose = require('mongoose');
const TypeAbonnement = require('./TypeAbonnement');

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
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        default: null
    },
    prix: {
        type: Number,
        required: true
    },
    statut: {
        type: String,
        enum: ['En cours', 'Terminé'],
        default: 'En cours'
    }

}, { timestamps: true });

/* Middleware calcul dateFin */
AbonnementSchema.pre('save', async function () {

    try {

        const type = await TypeAbonnement.findById(this.typeAbonnement);

        if (!type) throw new Error('Type abonnement introuvable');

        let mois = type.type === 'mensuel' ? 1 :
                   type.type === 'trimestriel' ? 3 :
                   type.type === 'annuel' ? 12 : 0;

        const dateFin = new Date(this.dateDebut);
        dateFin.setMonth(dateFin.getMonth() + mois);

        this.dateFin = dateFin;

        /* Mise à jour statut automatique */
        this.statut = dateFin < new Date() ? 'Terminé' : 'En cours';

    } catch (error) {
        throw error;
    }

});

module.exports = mongoose.model('Abonnement', AbonnementSchema, 'abonnement');