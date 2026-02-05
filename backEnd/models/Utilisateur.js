const mongoose = require('mongoose');
const UtilisateurSchema = new mongoose.Schema({
    role: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Role' },
        libelle: { type: String, required: true },
    },
    nomUtilisateur: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    numero: { type: String, required: true },
    motDePasse: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Utilisateur', UtilisateurSchema, 'utilisateur');