import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { SortieProduitService } from '../../../services/sortie-produit.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-sortie-produit',
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sortie-produit.component.html',
  styleUrl: './sortie-produit.component.css'
})
export class SortieProduitComponent {
  displayedColumns: string[] = ['date', 'nom', 'quantiteVente', 'prixVente', 'montantTotal','devise'];
  dataSource = new MatTableDataSource<any>([]);

  private storageService = inject(StorageService)
  private SortieProduitService = inject(SortieProduitService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupFilter();
      this.getSortieProduitByBoutique();
    }
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const searchableFields = [
        data.produit?.nom || '',                    // Nom du produit
        data.boutique?.nomUtilisateur || '',        // Nom de la boutique
        data.quantiteVente?.toString() || '',            // Quantité
        data.prixVente?.toString() || '',           // Prix vente
        data.montantTotal?.toString() || '',        // Montant total
      ];

      // Combiner tous les champs en une seule chaîne
      const dataStr = searchableFields.join(' ').toLowerCase();

      // Vérifier si le filtre est présent
      return dataStr.includes(filter);
    };
  }

  getSortieProduitByBoutique() {
    const boutiqueId = this.storageService.getItem('userId');
    if (!boutiqueId) {
      console.error('Boutique ID not found in sortieProduit');
      return;
    }

    this.SortieProduitService.getSortieProduitByBoutique(boutiqueId).subscribe(
      (data) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching sortie produit:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
