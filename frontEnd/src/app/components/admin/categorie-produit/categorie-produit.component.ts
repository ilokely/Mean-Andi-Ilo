import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../../services/categorie.service';
import { FooterComponent } from '../../common/footer/footer.component';
import { MenuComponent } from '../menu/menu.component';

declare var bootstrap: any;

@Component({
  selector: 'app-categorie-produit',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    FooterComponent,
    MenuComponent
  ],
  templateUrl: './categorie-produit.component.html',
  styleUrl: './categorie-produit.component.css'
})
export class CategorieProduitComponent implements OnInit {
  categories: any[] = [];
  
  newCategorie = {
    libelle: ''
  };

  editingCategorie: any = null;

  constructor(private categorieService: CategorieService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Catégories chargées:', data);
      },
      error: (error) => {
        console.error('Erreur chargement catégories:', error);
        alert('Erreur lors du chargement des catégories');
      }
    });
  }

  addCategorie(): void {
    if (!this.newCategorie.libelle || this.newCategorie.libelle.trim() === '') {
      alert('Le libellé est requis');
      return;
    }

    this.categorieService.addCategorie(this.newCategorie).subscribe({
      next: (response) => {
        console.log('Catégorie ajoutée:', response);
        this.loadCategories();
        this.newCategorie.libelle = '';
        this.closeModal('CategorieModal');
        alert('Catégorie ajoutée avec succès !');
      },
      error: (error) => {
        console.error('Erreur ajout catégorie:', error);
        alert('Erreur lors de l\'ajout de la catégorie');
      }
    });
  }

  editCategorie(categorie: any): void {
    console.log('✏️ Édition catégorie:', categorie);
    
    this.editingCategorie = {
      _id: categorie._id,
      libelle: categorie.libelle
    };
    
    console.log('Objet à éditer:', this.editingCategorie);
    
    this.openModal('EditCategorieModal');
  }

  updateCategorie(): void {
    if (!this.editingCategorie || !this.editingCategorie.libelle || this.editingCategorie.libelle.trim() === '') {
      alert('Le libellé est requis');
      return;
    }

    console.log('Mise à jour catégorie:', this.editingCategorie);

    this.categorieService.updateCategorie(
      this.editingCategorie._id, 
      this.editingCategorie.libelle
    ).subscribe({
      next: (response) => {
        console.log('Réponse mise à jour:', response);
        
        this.loadCategories();
        
        this.closeModal('EditCategorieModal');
        
        this.editingCategorie = null;
        
        alert('Catégorie modifiée avec succès !');
      },
      error: (error) => {
        console.error('Erreur modification:', error);
        alert(error.error?.message || 'Erreur lors de la modification');
      }
    });
  }

  deleteCategorie(categorie: any): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categorie.libelle}" ?`)) {
      return;
    }

    this.categorieService.deleteCategorie(categorie._id).subscribe({
      next: () => {
        console.log('Catégorie supprimée');
        this.loadCategories();
        alert('Catégorie supprimée avec succès !');
      },
      error: (error) => {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
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