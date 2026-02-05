const mongoose = require('mongoose');

const ImageProduitSchema = new mongoose.Schema({
    nom: { type: String },
    path: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ImageProduit', ImageProduitSchema, 'imageProduit');
