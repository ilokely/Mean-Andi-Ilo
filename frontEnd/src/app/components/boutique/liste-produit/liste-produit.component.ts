import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, ViewChild, viewChild } from '@angular/core';
import { ProduitService } from '../../../services/produit.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProduitDialogComponent } from './add-produit-dialog/add-produit-dialog.component';
import { StorageService } from '../../../services/storage.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EditProduitDialogComponent } from './edit-produit-dialog/edit-produit-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReapproProduitDialogComponent } from './reappro-produit-dialog/reappro-produit-dialog.component';
import { DetailsProduitComponent } from './details-produit/details-produit.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-liste-produit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    DetailsProduitComponent,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './liste-produit.component.html',
  styleUrl: './liste-produit.component.css'
})
export class ListeProduitComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private storageService = inject(StorageService);
  private platformId = inject(PLATFORM_ID);
  private snackBar = inject(MatSnackBar);
  private produitService = inject(ProduitService);

  produits: any[] = [];
  filteredProduits: any[] = [];
  selectedProduit: any = null;
  isLoading: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();

    if (!filterValue) {
      this.filteredProduits = this.produits;
      return;
    }

    this.filteredProduits = this.produits.filter(produit => {
      const searchableFields = [
        produit.nom || '',
        produit.marque || '',
        produit.description || '',
        produit.prixAchat?.toString() || '',
        produit.prixVente?.toString() || '',
        produit.stockActuel?.toString() || ''
      ];

      const dataStr = searchableFields.join(' ').toLowerCase();
      return dataStr.includes(filterValue);
    });
  }

  @ViewChild('detailsSidenav') detailsSidenav!: MatSidenav;


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProduits();
    }
  }

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

  openEditDialog(produit: any): void {
    const dialogRef = this.dialog.open(EditProduitDialogComponent, {
      width: '700px',
      disableClose: false,
      data: produit  // ✅ Passer le produit au dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open('Produit modifié avec succès !', 'Fermer', {
          duration: 3000
        });
        this.loadProduits();
      }
    });
  }

  openReapproDialog(produit: any): void {
    const dialogRef = this.dialog.open(ReapproProduitDialogComponent, {
      width: '500px',
      data: produit
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open(
          `${result.entree.quantite} unités ajoutées au stock !`,
          'Fermer',
          { duration: 3000 }
        );
        this.loadProduits();
      }
    });
  }

  openDetails(produit: any): void {
    this.selectedProduit = produit;
    this.detailsSidenav.open();
  }

  deleteProduit(produit: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer le produit',
        message: `Êtes-vous sûr de vouloir supprimer "${produit.nom}" ? Cette action est irréversible.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.produitService.deleteProduit(produit._id).subscribe({
          next: () => {
            this.snackBar.open('Produit supprimé avec succès !', 'Fermer', {
              duration: 3000
            });
            this.loadProduits();
          },
          error: (error) => {
            console.error('Erreur:', error);
            this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }



  loadProduits(): void {
    const boutiqueId = this.storageService.getItem('userId');
    if (!boutiqueId) {
      console.error('Boutique ID not found');
      return;
    }
    this.produitService.getProduitsByBoutique(boutiqueId).subscribe({
      next: (data) => {
        this.produits = data;
        this.filteredProduits = data;
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }
}
