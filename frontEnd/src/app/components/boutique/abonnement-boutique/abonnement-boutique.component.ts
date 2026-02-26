import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AAbonnementService } from '../../../services/a-abonnement.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-abonnement-boutique',
  imports: [MatIconModule,CommonModule],
  templateUrl: './abonnement-boutique.component.html',
  styleUrl: './abonnement-boutique.component.css'
})
export class AbonnementBoutiqueComponent implements OnInit {
  abonnement: any = {};
  isLoading: boolean = true;
  errorMessage: string = '';

  private platformId = inject(PLATFORM_ID);
  private storageService = inject(StorageService);
  private abonnementService = inject(AAbonnementService);

  constructor() { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.loadAbo();
    }
  }

  loadAbo(): void{
    const idUser = this.storageService.getItem('userId');

    if (!idUser) {
      console.error('Aucun ID utilisateur trouvé');
      this.errorMessage = 'Utilisateur non connecté';
      this.isLoading = false;
      return;
    }

    this.abonnementService.getAbonnementByBoutique(idUser).subscribe({
      next: (data) => {        
        if (Array.isArray(data)) {
          console.log('Tableau reçu avec', data.length, 'abonnement(s)');
          
          if (data.length > 0) {
            this.abonnement = data[0];
            console.log('Abonnement sélectionné:', this.abonnement);
          } else {
            console.log('Tableau vide');
            this.errorMessage = 'Aucun abonnement trouvé';
          }
        } else {
          // C'est déjà un objet unique
          this.abonnement = data;
          console.log('Abonnement reçu:', this.abonnement);
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.errorMessage = error.error?.message || 'Erreur de chargement';
        this.isLoading = false;
      }
    });
  }
}
