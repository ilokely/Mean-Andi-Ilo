const Produit = require('./models/Produit');

async function verifierTousLesStocks() {
    const produits = await Produit.find();
    
    for (const produit of produits) {
        const stockAvant = produit.stockActuel;
        await produit.calculerStock();
        const stockApres = produit.stockActuel;
        
        if (stockAvant !== stockApres) {
            console.log(`⚠️ Stock corrigé pour ${produit.nom}: ${stockAvant} → ${stockApres}`);
        }
    }
    
    console.log('✅ Vérification terminée');
}

verifierTousLesStocks();