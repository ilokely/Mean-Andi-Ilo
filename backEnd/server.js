const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connecté"))
    .catch(err => console.log("Erreur MongoDB :", err));


app.use('/utilisateur', require('./routes/utilisateurRoutes'));
app.use('/box' , require('./routes/boxRoutes'));
app.use('/typeabo' , require('./routes/typesAbonnementRoutes'));
app.use('/abo' , require('./routes/abonnementRoutes'));

app.use('/categorieProduit' , require('./routes/categorieProduitRoutes'));
app.use('/produit' , require('./routes/produitRoutes'));
app.use('/panier' , require('./routes/panierRoutes'));





app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));