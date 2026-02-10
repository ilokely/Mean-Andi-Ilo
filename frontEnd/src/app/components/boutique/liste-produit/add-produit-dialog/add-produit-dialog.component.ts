import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProduitService } from '../../../../services/produit.service';
import { CategorieService } from '../../../../services/categorie.service';
import { StorageService } from '../../../../services/storage.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-produit-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './add-produit-dialog.component.html',
  styleUrl: './add-produit-dialog.component.css'
})
export class AddProduitDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddProduitDialogComponent>);
  private produitService = inject(ProduitService);
  private categorieService = inject(CategorieService);
  private storageService = inject(StorageService);

  produitForm!: FormGroup;
  categories: any[] = [];
  selectedFile: File | null = null;
  selectedFileName: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.produitForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      marque: [''],
      description: [''],
      categorieId: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      prixAchat: [0, [Validators.required, Validators.min(0)]],
      quantiteInitiale: [0, [Validators.required, Validators.min(0)]],
      devise: ['EUR', Validators.required]
    })
  }

  loadCategories(): void {
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories chargées', this.categories);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des categories:', error);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      console.log('Fichier selectionne : ', file.name);
    }
  }

  onSubmit(): void {
    if (this.produitForm.invalid) {
      console.log('Formulaire invalide');
      this.produitForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const boutiqueId = this.storageService.getItem('userId');

    if (!boutiqueId) {
      console.error('Aucun utilisateur connecté');
      alert('Vous devez être connecté pour ajouter un produit');
      this.isLoading = false;
      return;
    }

    const formData = {
      ...this.produitForm.value,
      boutiqueId: boutiqueId
      // imageId: '000000000000000'
    };

    console.log('Données à envoyer', formData);

    this.produitService.addProduit(formData).subscribe({
      next: (response) => {
        console.log('Produit créé avec succès: ', response);
        this.isLoading = false;

        this.dialogRef.close({
          success: true,
          produit: response.produit
        });
      },
      error: (error) => {
        console.log('Erreur lors de la creation du produit: ', error);
        this.isLoading = false;

        alert('Erreur lors de la création du produit: ' + error.error?.error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }

}
