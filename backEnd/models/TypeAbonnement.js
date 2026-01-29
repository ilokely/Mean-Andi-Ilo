const mongoose = require('mongoose');

const TypeAbonnementSchema = new mongoose.Schema({
    type: { type: String, required: true },
    reduction: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TypeAbonnement', TypeAbonnementSchema, 'typeAbonnement');
