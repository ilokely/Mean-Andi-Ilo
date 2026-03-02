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
import { CategorieService } from '../../../services/categorie.service';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageUrlPipe } from '../../../pipes/image-url.pipe';

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
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ImageUrlPipe  
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
  private categorieService =inject(CategorieService);

  produits: any[] = [];
  filteredProduits: any[] = [];
  selectedProduit: any = null;

  categories: any[] = [];
  selectedCategories: Set<string> = new Set();  
  searchText: string = '';

  isLoading: boolean = false;

  @ViewChild('detailsSidenav') detailsSidenav!: MatSidenav;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
      this.loadProduits();
    }
  }

  applyFilter(event?: Event): void {
    let filtered = [...this.produits];

    //Filtrer par texte de recherche
    if (event) {
      this.searchText = (event.target as HTMLInputElement).value.toLowerCase().trim();
    }

    if (this.searchText) {
      filtered = filtered.filter(produit => {
        const searchableFields = [
          produit.nom || '',
          produit.marque || '',
          produit.description || '',
          produit.categorieProduit?.libelle || '',
          produit.prixAchat?.toString() || '',
          produit.prixVente?.toString() || '',
          produit.stockActuel?.toString() || ''
        ];

        const dataStr = searchableFields.join(' ').toLowerCase();
        return dataStr.includes(this.searchText);
      });
    }

    // Filtrer par catégories sélectionnées
    if (this.selectedCategories.size > 0) {
      filtered = filtered.filter(produit => 
        this.selectedCategories.has(produit.categorieProduit?.id)
      );
    }

    this.filteredProduits = filtered;

    console.log('🔍 Filtrage:', {
      total: this.produits.length,
      recherche: this.searchText,
      categoriesSelectionnees: this.selectedCategories.size,
      resultats: filtered.length
    });
  }

  toggleCategorie(categorieId: string, checked: boolean): void {
    if (checked) {
      this.selectedCategories.add(categorieId);
    } else {
      this.selectedCategories.delete(categorieId);
    }

    console.log('Catégories sélectionnées:', Array.from(this.selectedCategories));
    this.applyFilter();
  }

  resetFilters(): void {
    this.selectedCategories.clear();
    this.searchText = '';
    this.filteredProduits = this.produits;
    console.log('Filtres réinitialisés');
  }

  getProductCountForCategory(categorieId: string): number {
    return this.produits.filter(p => p.categorieProduit?.id === categorieId).length;
  }

  // NOUVEAU : Vérifier si une catégorie est sélectionnée
  isCategorieSelected(categorieId: string): boolean {
    return this.selectedCategories.has(categorieId);
  }

  loadCategories(): void {
    this.categorieService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = Array.isArray(data) ? data : [];
        console.log('Catégories chargées:', this.categories);
      },
      error: (error) => {
        console.error('Erreur chargement catégories:', error);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddProduitDialogComponent, {
      width: '600px',
      height: '600px',
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
      data: produit  
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
    this.isLoading = true;
    this.produitService.getProduitsByBoutique(boutiqueId).subscribe({
      next: (data) => {
        this.produits = data;
        this.filteredProduits = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
      }
    });
  }
}
