Role : {
  _id: ObjectId,
  libelle: String,
  valeur: Number
}

Utilisateur : {
  _id: ObjectId,
  nomUtilisateur: String,
  email: String,
  numero: String,
  motDePasse: String,
  role: {
    id: ObjectId,
    libelle: String,
    valeur: Number
  }
}

Box : {
  _id: ObjectId,
  nom: String,
  surface: Number,
  etage: Number,
  prix: Number,
  isAvailable: Boolean
}

TypeAbonnement : {
  _id: ObjectId,
  type: String, // mensuel, trimestriel, annuel
  reduction: Number // pourcentage
}

Abonnement : {
  _id: ObjectId,
  utilisateur: {
    id: ObjectId,
    nomUtilisateur: String
  },
  box: {
    id: ObjectId,
    nom: String
  },
  typeAbonnement: {
    id: ObjectId,
    type: String
  },
  dateDebut: Date,
  prix: Number, // prix du box au moment de l’insertion
  statut: String // en cours, expiré
}

CategorieProduit : {
  _id: ObjectId,
  libelle: String
}

imageProduit : {
    _id: ObjectId,
    path : String        
}

Produit : {
  _id: ObjectId,
  boutique: {
    id: ObjectId,
    nomUtilisateur: String
  },
  nom: String,
  description: String,
  categorieProduit: {
    id: ObjectId,
    libelle: String
  }
  imageProduit: {
    id: ObjectId,
    path: String
  }
}

Panier : {
  _id: ObjectId,
  utilisateur: {
    id: ObjectId,
    nomUtilisateur: String
  },
  produits: [{
    produit: {
      id: ObjectId,
      nom: String
    },
    quantite: Number,
    prix: Number
  }]
}

Commande : {
  _id: ObjectId,
  panier: [{
    produit: {
      id: ObjectId,
      nom: String
    },
    quantite: Number,
    prix: Number
  }],
  dateCommande: Date,
  statut: String
}

EntreeProduit : {
  _id: ObjectId,
  produit: {
    id: ObjectId,
    nom: String
  },
  date: Date,
  quantite: Number,
  prix: Number
}

SortieProduit : {
  _id: ObjectId,
  produit: {
    id: ObjectId,
    nom: String
  },
  date: Date,
  quantite: Number
}

-- =========================
-- DONNÉES STATIQUES
-- =========================

// Pour Role
[
  { "_id": 1, "role": "Admin", "valeur": 10 },
  { "_id": 2, "role": "Boutique", "valeur": 20 },
  { "_id": 3, "role": "Client", "valeur": 30 }
]

// Pour TypeAbonnement
[
  { "_id": 1, "type": "Mensuel", "reduction": 0 },
  { "_id": 2, "type": "Trimestriel", "reduction": 5 },
  { "_id": 3, "type": "Annuel", "reduction": 10 }
]

// Pour Statut Abonnement
[
  { "_id": 1, "statut": "En cours" },
  { "_id": 2, "statut": "Expiré" }
]

// Pour Statut Commande
[
  { "_id": 1, "statut": "En attente" },
  { "_id": 2, "statut": "Payée" },
  { "_id": 3, "statut": "Livrée" }
]
