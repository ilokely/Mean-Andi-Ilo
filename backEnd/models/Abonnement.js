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
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, default: null },
    prix: { type: Number, required: true },
    statut: {
        type: String,
        enum: ['En cours', 'Terminé'],
        default: 'En cours'
    }
}, { timestamps: true });

AbonnementSchema.pre('save', async function () {

        const type = await TypeAbonnement.findById(this.typeAbonnement);

        if (!type) {
            throw new Error('Type abonnement introuvable');
        }

        let mois = 0;

        if (type.type === 'mensuel') mois = 1;
        else if (type.type === 'trimestriel') mois = 3;
        else if (type.type === 'annuel') mois = 12;

        const dateFin = new Date(this.dateDebut);
        dateFin.setMonth(dateFin.getMonth() + mois);

        this.dateFin = dateFin;
    }
);

module.exports = mongoose.model('Abonnement', AbonnementSchema, 'abonnement');