const mongoose = require('mongoose');

const BoxSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    surface: { type: Number, required: true },
    etage: { type: Number, required: true },
    prix: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Box', BoxSchema, 'box');
