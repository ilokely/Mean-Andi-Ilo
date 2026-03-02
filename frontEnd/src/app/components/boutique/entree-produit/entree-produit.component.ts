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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
 
@Component({
  selector: 'app-entree-produit',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
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
  displayedColumns: string[] = ['date', 'nom', 'quantite', 'prixAchat', 'montantTotal','devise'];
  dataSource = new MatTableDataSource<any>([]);

  filterValues = {
    text: '',
    date: ''
  };
  selectedDate: Date | null = null;

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
      const searchTerms = JSON.parse(filter);
      
      // 1. Logique du filtre texte
      const searchableFields = [
        data.produit?.nom || '',
        data.quantite?.toString() || '',
        data.prixAchat?.toString() || '',
      ].join(' ').toLowerCase();
      const textMatch = searchableFields.includes(searchTerms.text.toLowerCase());

      // 2. Logique du filtre date
      let dateMatch = true;
      if (searchTerms.date) {
        const rowDate = new Date(data.date).setHours(0,0,0,0);
        const filterDate = new Date(searchTerms.date).setHours(0,0,0,0);
        dateMatch = rowDate === filterDate;
      }

      return textMatch && dateMatch;
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

  applyTextFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterValues.text = value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  applyDateFilter(date: Date | null) {
    this.selectedDate = date;
    this.filterValues.date = date ? date.toISOString() : '';
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  resetDateFilter() {
    this.selectedDate = null;
    this.filterValues.date = '';
    this.dataSource.filter = JSON.stringify(this.filterValues);
    // Note: Pour vider visuellement l'input, il faudrait utiliser un [(ngModel)] sur l'input date
  }
}
