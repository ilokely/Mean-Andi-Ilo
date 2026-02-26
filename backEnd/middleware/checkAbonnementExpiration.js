const Abonnement = require('../models/Abonnement');

const checkAbonnementExpiration = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Début de la journée

        const abonnementsExpires = await Abonnement.updateMany(
            {
                statut: 'En cours',
                dateFin: { $lte: today }
            },
            {
                $set: { statut: 'Terminé' }
            }
        );

        if (abonnementsExpires.modifiedCount > 0) {
            console.log(`${abonnementsExpires.modifiedCount} abonnement(s) expiré(s) mis à jour`);
        }

        next();
    } catch (error) {
        console.error('Erreur vérification expiration:', error);
        next();
    }
};

module.exports = checkAbonnementExpiration;