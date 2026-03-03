import { Component } from '@angular/core';
import { FooterComponent } from '../../common/footer/footer.component';
import { MenuClientComponent } from "../menu-client/menu-client.component";
import { ProduitService } from '../../../services/produit.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortieProduitService } from '../../../services/sortie-produit.service';
import { ImageUrlPipe } from '../../../pipes/image-url.pipe';

@Component({
  selector: 'app-accueil',
  imports: [FooterComponent, MenuClientComponent, FormsModule, CommonModule,ImageUrlPipe],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  produits: any[] = [];
  panier: any[] = [];
  rechercheTexte: string = '';
  sortieProduitShema: any = {
    produitId: null,
    boutiqueId: null,
    quantite: 0,
  };

  constructor(private produitService: ProduitService, private sortieProduitService: SortieProduitService) { }

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getProduits().subscribe(data => {
      console.log("Produits chargés :", data);
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
      total + (item.prixVente * item.quantite), 0);
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

  // NOMBRE TOTAL D'ARTICLES (avec quantités)
  get nombreArticlesPanier(): number {
    return this.panier.reduce((total, item) =>
      total + item.quantite, 0);
  }

  // PRODUITS FILTRÉS
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

    this.passerCommande();
    this.panier = [];

  }

  passerCommande(): void {
    if (this.panier.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    this.panier.forEach(item => {

      const sortieProduitSchema = {
        produitId: item._id,
        boutiqueId: item.boutique.id,
        quantiteVente: item.quantite
      };

      this.sortieProduitService.addSortieProduit(sortieProduitSchema)
        .subscribe({
          next: (response) => {
            console.log("Sortie créée :", response);
            alert("Paiement effectué avec succès !");

          },
          error: (err) => {
            console.error("Erreur backend :", err);

            if (err.status === 400) {
              alert(err.error.error); // 🔥 message stock insuffisant
            } else if (err.status === 404) {
              alert("Produit ou boutique introuvable");
            } else {
              alert("Erreur serveur");
            }
          }
        });
    });

    this.panier = [];
    this.fermerConfirmation();
  }
}