import { Component, inject, PLATFORM_ID } from '@angular/core';
import { EntreeProduitService } from '../../../services/entree-produit.service';
import { StorageService } from '../../../services/storage.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
 
@Component({
  selector: 'app-entree-produit',
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './entree-produit.component.html',
  styleUrl: './entree-produit.component.css'
})
export class EntreeProduitComponent {
  displayedColumns: string[] = ['nom', 'date', 'quantite', 'prixAchat', 'montantTotal','devise'];
  dataSource = new MatTableDataSource<any>([]);

  private storageService = inject(StorageService)
  private EntreeProduitService = inject(EntreeProduitService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupFilter();
      this.getEntreeProduitByBoutique();
    }
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const searchableFields = [
        data.produit?.nom || '',                    // Nom du produit
        data.boutique?.nomUtilisateur || '',        // Nom de la boutique
        data.quantite?.toString() || '',            // Quantité
        data.prixAchat?.toString() || '',           // Prix d'achat
        data.montantTotal?.toString() || '',        // Montant total
      ];

      // Combiner tous les champs en une seule chaîne
      const dataStr = searchableFields.join(' ').toLowerCase();

      // Vérifier si le filtre est présent
      return dataStr.includes(filter);
    };
  }

  getEntreeProduitByBoutique() {
    const boutiqueId = this.storageService.getItem('userId');
    if (!boutiqueId) {
      console.error('Boutique ID not found in entreeProduit');
      return;
    }

    this.EntreeProduitService.getEntreeProduitByBoutique(boutiqueId).subscribe(
      (data) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching entree produit:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
