import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AAbonnementService } from '../../../services/a-abonnement.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReabonnementBoutiqueDialogComponent } from './reabonnement-boutique-dialog/reabonnement-boutique-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-abonnement-boutique',
  imports: [MatIconModule, CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './abonnement-boutique.component.html',
  styleUrl: './abonnement-boutique.component.css'
})
export class AbonnementBoutiqueComponent implements OnInit {
  abonnement: any = {};
  isLoading: boolean = true;
  errorMessage: string = '';
  today = new Date();

  get sevenDaysFromNow(): Date {
    const date = new Date(this.today);
    date.setDate(date.getDate() + 7);
    return date;
  }

  private platformId = inject(PLATFORM_ID);
  private storageService = inject(StorageService);
  private abonnementService = inject(AAbonnementService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAbo();
    }
  }

  openReabonnementDialog(): void {
    const dialogRef = this.dialog.open(ReabonnementBoutiqueDialogComponent, {
      width: '600px',
      data: {
        utilisateurId: this.abonnement.utilisateur._id,
        ancienAbonnement: this.abonnement
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.snackBar.open('Réabonnement effectué avec succès !', 'Fermer', {
          duration: 3000
        });
        this.loadAbo();
      }
    });
  }

  loadAbo(): void {
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

  get isExpired(): boolean {
    if (!this.abonnement || this.abonnement.statut !== 'Terminé') {
      return false;
    }
    return true;
  }
}
