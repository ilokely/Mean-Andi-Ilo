import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ProduitService } from '../../../services/produit.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddProduitDialogComponent } from './add-produit-dialog/add-produit-dialog.component';

@Component({
  selector: 'app-liste-produit',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './liste-produit.component.html',
  styleUrl: './liste-produit.component.css'
})
export class ListeProduitComponent implements OnInit {
  produits: any[] = [];
  readonly dialog = inject(MatDialog);

  constructor(private produitService: ProduitService) { }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddProduitDialogComponent, {
      width: '600px',
      height: '550px',
      disableClose: false  // Empêche la fermeture en cliquant à l'extérieur
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog fermé avec résultat:', result);

      if (result?.success) {
        console.log('Produit ajouté:', result.produit);

        this.loadProduits();

        // Ou ajouter directement à la liste sans recharger
        // this.produits.push(result.produit);
      }
    });
  }

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }
}
