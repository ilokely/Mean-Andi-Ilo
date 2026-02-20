import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { EntreeProduitService } from '../../../../services/entree-produit.service';

@Component({
  selector: 'app-reappro-produit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './reappro-produit-dialog.component.html',
  styleUrl: './reappro-produit-dialog.component.css'
})
export class ReapproProduitDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ReapproProduitDialogComponent>);
  private entreeProduitService = inject(EntreeProduitService);
  
  public data = inject<any>(MAT_DIALOG_DATA);

  reapproForm!: FormGroup;
  isLoading: boolean = false;
  // quantiteRecommandee: number = 0;

  ngOnInit(): void {
    // //  Calculer la quantité recommandée
    // this.quantiteRecommandee = Math.max(
    //   this.data.stockMinimum * 2,  // Au moins 2x le stock minimum
    //   20  // Minimum 20 unités
    // );

    this.initForm();
  }

  initForm(): void {
    this.reapproForm = this.fb.group({
      quantite: [this.data.quantite, [Validators.required, Validators.min(1)]],
      prixAchat: [this.data.prixAchat || 0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.reapproForm.invalid) {
      this.reapproForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const entreeData = {
      produitId: this.data._id,
      boutiqueId: this.data.boutique.id,
      ...this.reapproForm.value
    };

    this.entreeProduitService.addEntreeProduit(entreeData).subscribe({
      next: (response) => {
        console.log('Réapprovisionnement créé:', response);
        this.isLoading = false;
        this.dialogRef.close({
          success: true,
          entree: response
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