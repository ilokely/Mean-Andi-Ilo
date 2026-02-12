import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CategorieService } from '../../../../services/categorie.service';
import { ProduitService } from '../../../../services/produit.service';

@Component({
  selector: 'app-edit-produit-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-produit-dialog.component.html',
  styleUrl: './edit-produit-dialog.component.css'
})
export class EditProduitDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditProduitDialogComponent>);
  private produitService = inject(ProduitService);
  private categorieService = inject(CategorieService);
  private http = inject(HttpClient);
  
  // Récupérer le produit passé en paramètre
  public data = inject<any>(MAT_DIALOG_DATA);

  produitForm!: FormGroup;
  categories: any[] = [];
  // selectedFile: File | null = null;
  // selectedFileName: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.produitForm = this.fb.group({
      nom: [this.data.nom || '', [Validators.required, Validators.minLength(3)]],
      marque: [this.data.marque || ''],
      description: [this.data.description || ''],
      categorieId: [this.data.categorieProduit?.id || '', Validators.required],
      prix: [this.data.prix || 0, [Validators.required, Validators.min(0)]],
      devise: [this.data.devise || 'EUR', Validators.required]
    });
  }

  loadCategories(): void {
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Erreur chargement catégories:', error);
      }
    });
  }

  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     this.selectedFileName = file.name;
  //   }
  // }

  onSubmit(): void {
    if (this.produitForm.invalid) {
      this.produitForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Préparer les données à envoyer
    const formData = {
      ...this.produitForm.value
      // Ne pas inclure boutiqueId car c'est une mise à jour
    };

    console.log('Mise à jour du produit:', formData);

    this.produitService.updateProduit(this.data._id, formData).subscribe({
      next: (response) => {
        console.log('Produit mis à jour:', response);
        this.isLoading = false;
        
        this.dialogRef.close({
          success: true,
          produit: response
        });
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
        alert('Erreur: ' + (error.error?.error || error.message));
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
}

}