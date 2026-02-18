const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');
const Role = require('../models/Role');

//getAllUsers except Admins
router.get('/notAdmin', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find({
            role: { $ne: 'Admin' }
        });
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//getAllBoutique
router.get('/boutique', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find({
            'role.libelle': 'Boutique'
        });
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//getAllClient
router.get('/client', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find({
            'role.libelle': 'Client'
        });
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find();
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/boutique', async (req, res) => {
    try {
        const { nomUtilisateur, email, numero, motDePasse } = req.body;

        if (!nomUtilisateur || !email || !numero || !motDePasse) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const exist = await Utilisateur.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        const roleBoutique = await Role.findOne({ libelle: "Boutique" });
        if (!roleBoutique) {
            return res.status(400).json({ message: "Rôle Boutique introuvable" });
        }

        const bcrypt = require('bcrypt');

        // 🔐 Hash mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const nouvelUtilisateur = new Utilisateur({
            role: {
                id: roleBoutique._id,
                libelle: roleBoutique.libelle
            },
            nomUtilisateur,
            email,
            numero,
            motDePasse: hashedPassword
        });

        await nouvelUtilisateur.save();

        const userResponse = nouvelUtilisateur.toObject();
        delete userResponse.motDePasse;

        res.status(201).json(userResponse);

    } catch (error) {
        console.error("Erreur création boutique :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post('/client', async (req, res) => {
    try {
        const { nomUtilisateur, email, numero, motDePasse } = req.body;

        if (!nomUtilisateur || !email || !numero || !motDePasse) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const exist = await Utilisateur.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        const roleClient = await Role.findOne({ libelle: "Client" });
        if (!roleClient) {
            return res.status(400).json({ message: "Rôle Client introuvable" });
        }

        const bcrypt = require('bcrypt');

        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const nouvelUtilisateur = new Utilisateur({
            role: {
                id: roleClient._id,
                libelle: roleClient.libelle
            },
            nomUtilisateur,
            email,
            numero,
            motDePasse: hashedPassword
        });

        await nouvelUtilisateur.save();

        // 🚫 Ne pas renvoyer motDePasse
        const userResponse = nouvelUtilisateur.toObject();
        delete userResponse.motDePasse;

        res.status(201).json(userResponse);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, motDePasse } = req.body;
        console.log("Tentative de login avec email :", email, motDePasse);

        if (!email || !motDePasse) {
            return res.status(400).json({ error: "Email et mot de passe requis" });
        }

        const user = await Utilisateur.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Email ou mot de passe invalide" });
        }

        let motDePasseValide = false;

        if (user.motDePasse.startsWith('$2b$')) {
            const bcrypt = require('bcrypt');
            motDePasseValide = await bcrypt.compare(motDePasse, user.motDePasse);
        } else {
            motDePasseValide = motDePasse === user.motDePasse;
        }

        if (!motDePasseValide) {
            return res.status(401).json({ error: "Email ou mot de passe invalide" });
        }

        const userResponse = user.toObject();
        delete userResponse.motDePasse;

        res.json({ user: userResponse });

    } catch (error) {
        console.error("Erreur login :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await Utilisateur.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id/role', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(utilisateur.role.libelle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/updateUserInfo/:id', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        utilisateur.nomUtilisateur = req.body.nomUtilisateur;
        utilisateur.email = req.body.email;
        utilisateur.numero = req.body.numero;
        await utilisateur.save();
        res.json(utilisateur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        await utilisateur.remove();
        res.json({ message: "Utilisateur supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;