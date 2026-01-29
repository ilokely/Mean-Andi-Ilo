const mongoose = require('mongoose');

const ImageProduitSchema = new mongoose.Schema({
    path: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ImageProduit', ImageProduitSchema, 'imageProduit');
