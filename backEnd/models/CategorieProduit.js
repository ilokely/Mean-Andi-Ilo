const mongoose = require('mongoose');

const CategorieProduitSchema = new mongoose.Schema({
    libelle: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CategorieProduit', CategorieProduitSchema, 'categorieProduit');
