const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    libelle: { type: String, required: true },
    valeur: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema, 'role');
