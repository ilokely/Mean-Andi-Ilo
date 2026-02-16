import { Component } from '@angular/core';
import { FooterComponent } from '../../common/footer/footer.component';
import { MenuClientComponent } from "../menu-client/menu-client.component";
import { ProduitService } from '../../../services/produit.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  imports: [FooterComponent, MenuClientComponent, FormsModule , CommonModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  produits: any[] = [];
  panier: any[] = [];
  rechercheTexte: string = '';

  constructor(private produitService: ProduitService) { }

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getProduits().subscribe(data => {
      this.produits = data as any[];
    });
  }

 ajouterAuPanier(produit: any): void {

    const produitExistant = this.panier.find(p => p._id === produit._id);

    if (produitExistant) {
      produitExistant.quantite += 1;
    } else {
      this.panier.push({
        ...produit,
        quantite: 1
      });
    }
  }

  supprimerDuPanier(index: number): void {
    this.panier.splice(index, 1);
  }

  augmenterQuantite(index: number): void {
    this.panier[index].quantite++;
  }

  diminuerQuantite(index: number): void {
    if (this.panier[index].quantite > 1) {
      this.panier[index].quantite--;
    } else {
      this.supprimerDuPanier(index);
    }
  }

  totalPanier(): number {
    return this.panier.reduce((total, item) =>
      total + (item.prix * item.quantite), 0);
  }

  voirPanier(): void {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('panierModal')
    );
    modal.show();
  }

  fermerPanier(): void {
    const modalEl = document.getElementById('panierModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  // ✅ NOMBRE TOTAL D'ARTICLES (avec quantités)
  get nombreArticlesPanier(): number {
    return this.panier.reduce((total, item) =>
      total + item.quantite, 0);
  }

  // ✅ PRODUITS FILTRÉS
  get produitsFiltres(): any[] {
    if (!this.rechercheTexte) return this.produits;

    const texte = this.rechercheTexte.toLowerCase();

    return this.produits.filter(prod =>
      prod.nom.toLowerCase().includes(texte) ||
      prod.boutique.nomUtilisateur.toLowerCase().includes(texte)
    );
  }

  ouvrirConfirmation(): void {

  this.fermerPanier();
  console.log("Commande confirmée :", this.panier);

  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('confirmationModal')
  );

  modal.show();
}

fermerConfirmation(): void {
  const modalEl = document.getElementById('confirmationModal');
  const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
  modal.hide();
}

confirmerCommande(): void {

  alert("Paiement effectué avec succès !");

  // Vider le panier après paiement
  this.panier = [];

  this.fermerConfirmation();
}
}
