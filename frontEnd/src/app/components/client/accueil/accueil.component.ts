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

  ajouterAuPanier(produit: any) {
    this.panier.push(produit);
  }

  supprimerDuPanier(index: number) {
    this.panier.splice(index, 1);
  }

  totalPanier(): number {
    return this.panier.reduce((total, p) => total + p.prix, 0);
  }

  voirPanier() {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('panierModal')
    );
    modal.show();
  }

  fermerPanier() {
    const modalEl = document.getElementById('panierModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  get nombreArticlesPanier(): number {
  return this.panier.length;
  }

  // Getter pour les produits filtrés
  get produitsFiltres(): any[] {
    if (!this.rechercheTexte) return this.produits;
    const texte = this.rechercheTexte.toLowerCase();
    return this.produits.filter(prod =>
      prod.nom.toLowerCase().includes(texte) || 
      prod.boutique.nomUtilisateur.toLowerCase().includes(texte)
    );
  }
}
