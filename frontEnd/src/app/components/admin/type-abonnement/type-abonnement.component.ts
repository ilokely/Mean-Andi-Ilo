import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ATypeAbonnementService } from '../../../services/a-type-abonnement.service';
import { FooterComponent } from '../../common/footer/footer.component';
import { MenuComponent } from '../menu/menu.component';

declare var bootstrap: any;

@Component({
  selector: 'app-type-abonnement',
  standalone: true,
  imports: [CommonModule, FormsModule,FooterComponent,MenuComponent],
  templateUrl: './type-abonnement.component.html',
  styleUrl: './type-abonnement.component.css'
})
export class TypeAbonnementComponent implements OnInit {
  typesAbonnement: any[] = [];
  
  newType = {
    type: '',
    reduction: 0
  };

  editingType: any = null;

  constructor(private typeAbonnementService: ATypeAbonnementService) { }

  ngOnInit(): void {
    this.loadTypes();
  }

  loadTypes(): void {
    console.log('Chargement des types d\'abonnement...');
    
    this.typeAbonnementService.getTypeAbonnements().subscribe({
      next: (data: any) => {
        console.log('Données reçues:', data);
        this.typesAbonnement = Array.isArray(data) ? data : [];
        console.log(' Types chargés:', this.typesAbonnement);
      },
      error: (error) => {
        console.error(' Erreur chargement:', error);
        alert('Erreur lors du chargement des types d\'abonnement');
        this.typesAbonnement = [];
      }
    });
  }

  addType(): void {
    if (!this.newType.type || this.newType.type.trim() === '') {
      alert('Le type est requis');
      return;
    }

    if (this.newType.reduction < 0 || this.newType.reduction > 100) {
      alert('La réduction doit être entre 0 et 100%');
      return;
    }

    console.log('Ajout type:', this.newType);

    this.typeAbonnementService.addTypeAbonnement(this.newType).subscribe({
      next: (response) => {
        console.log('Réponse backend:', response);
        
        // Recharger la liste
        this.loadTypes();
        
        // Réinitialiser le formulaire
        this.newType = { type: '', reduction: 0 };
        
        // Fermer le modal
        this.closeModal('TypeAbonnementModal');
        
        alert('Type d\'abonnement ajouté avec succès !');
      },
      error: (error) => {
        console.error('Erreur ajout:', error);
        alert(error.error?.message || 'Erreur lors de l\'ajout');
      }
    });
  }

  editType(type: any): void {
    console.log('✏️ Édition type:', type);
    
    // Créer une copie profonde
    this.editingType = {
      _id: type._id,
      type: type.type,
      reduction: type.reduction
    };
    
    console.log('Objet à éditer:', this.editingType);
    
    // Ouvrir le modal
    this.openModal('EditTypeAbonnementModal');
  }

  updateType(): void {
    if (!this.editingType || !this.editingType.type || this.editingType.type.trim() === '') {
      alert('Le type est requis');
      return;
    }

    if (this.editingType.reduction < 0 || this.editingType.reduction > 100) {
      alert('La réduction doit être entre 0 et 100%');
      return;
    }

    console.log('Mise à jour type:', this.editingType);

    this.typeAbonnementService.updateTypeAbonnement(
      this.editingType._id,
      {
        type: this.editingType.type,
        reduction: this.editingType.reduction
      }
    ).subscribe({
      next: (response) => {
        console.log('Réponse mise à jour:', response);
        
        // Recharger la liste
        this.loadTypes();
        
        // Fermer le modal
        this.closeModal('EditTypeAbonnementModal');
        
        // Réinitialiser
        this.editingType = null;
        
        alert('Type d\'abonnement modifié avec succès !');
      },
      error: (error) => {
        console.error('Erreur modification:', error);
        alert(error.error?.message || 'Erreur lors de la modification');
      }
    });
  }

  deleteType(type: any): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le type "${type.type}" ?`)) {
      return;
    }

    console.log('Suppression type:', type);

    this.typeAbonnementService.deleteTypeAbonnement(type._id).subscribe({
      next: (response) => {
        console.log('Type supprimé');
        
        // Recharger la liste
        this.loadTypes();
        
        alert('Type d\'abonnement supprimé avec succès !');
      },
      error: (error) => {
        console.error('Erreur suppression:', error);
        alert(error.error?.message || 'Erreur lors de la suppression');
      }
    });
  }

  private openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  private closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}