const mongoose = require('mongoose');
const UtilisateurSchema = new mongoose.Schema({
    nomUtilisateur: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    numero: { type: String, required: true },
    motDePasse: { type: String, required: true },
    role: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        libelle: { type: String, required: true },
        valeur: { type: Number, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Utilisateur' , UtilisateurSchema , 'utilisateur');