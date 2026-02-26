import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AAbonnementService } from '../../../../services/a-abonnement.service';
import { ABoxService } from '../../../../services/a-box.service';
import { ATypeAbonnementService } from '../../../../services/a-type-abonnement.service';

@Component({
  selector: 'app-reabonnement-boutique-dialog',
  standalone: true,
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
  templateUrl: './reabonnement-boutique-dialog.component.html',
  styleUrl: './reabonnement-boutique-dialog.component.css'
})
export class ReabonnementBoutiqueDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ReabonnementBoutiqueDialogComponent>);
  private abonnementService = inject(AAbonnementService);
  private aBoxService = inject(ABoxService);
  private typeAbonnementService = inject(ATypeAbonnementService);
  public data = inject<any>(MAT_DIALOG_DATA);

  reabonnementForm!: FormGroup;
  isLoading: boolean = false;
  boxes: any[] = [];
  typesAbonnement: any[] = [];
  today: Date = new Date();
  dateFin: Date | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadOptions();
    this.listenToChanges();
    this.updateCalculations();
  }

  listenToChanges(): void {
    this.reabonnementForm.get('boxId')?.valueChanges.subscribe(() => {
      this.updateCalculations();
    });
    this.reabonnementForm.get('typeAbonnementId')?.valueChanges.subscribe(() => {
      this.updateCalculations();
    });
  }

  updateCalculations(): void {
    const boxId = this.reabonnementForm.get('boxId')?.value;
    const typeId = this.reabonnementForm.get('typeAbonnementId')?.value;

    const selectedBox = this.boxes.find(b => b._id === boxId) ||
      (this.data.ancienAbonnement?.box?._id === boxId ? this.data.ancienAbonnement.box : null);

    const selectedType = this.typesAbonnement.find(t => t._id === typeId) ||
      (this.data.ancienAbonnement?.typeAbonnement?._id === typeId ? this.data.ancienAbonnement.typeAbonnement : null);

    if (selectedBox && selectedType) {
      const reduction = selectedType.reduction || 0;
      const prixFinal = selectedBox.prix - (selectedBox.prix * (reduction / 100));
      this.reabonnementForm.patchValue({ prix: prixFinal }, { emitEvent: false });

      let mois = selectedType.type === 'mensuel' ? 1 :
        selectedType.type === 'trimestriel' ? 3 :
          selectedType.type === 'annuel' ? 12 : 0;

      const newDateFin = new Date(this.today);
      newDateFin.setMonth(newDateFin.getMonth() + mois);
      this.dateFin = newDateFin;
    }
  }

  initForm(): void {
    this.reabonnementForm = this.fb.group({
      boxId: [this.data.ancienAbonnement?.box?._id || '', Validators.required],
      typeAbonnementId: [this.data.ancienAbonnement?.typeAbonnement?._id || '', Validators.required],
      dateDebut: [this.data.ancienAbonnement?.dateDebut || ''],
      prix: [{ value: this.data.ancienAbonnement?.box?.prix || 0, disabled: true }]
    });
  }

  loadOptions(): void {
    // Charger les boxes
    this.aBoxService.getFreeBoxes().subscribe({
      next: (data) => {
        this.boxes = data as any[];
        if (this.data.ancienAbonnement?.box && !this.boxes.find(b => b._id === this.data.ancienAbonnement.box._id)) {
          this.boxes.push(this.data.ancienAbonnement.box);
        }
        this.updateCalculations();
      },
      error: (error) => {
        console.error('Erreur chargement boxes:', error);
      }
    });

    // Charger les types d'abonnement
    this.typeAbonnementService.getTypeAbonnements().subscribe({
      next: (data) => {
        this.typesAbonnement = data as any[];
        if (this.data.ancienAbonnement?.typeAbonnement && !this.typesAbonnement.find(t => t._id === this.data.ancienAbonnement.typeAbonnement._id)) {
          this.typesAbonnement.push(this.data.ancienAbonnement.typeAbonnement);
        }
        this.updateCalculations();
      },
      error: (error) => {
        console.error('Erreur chargement types:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.reabonnementForm.invalid) {
      this.reabonnementForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const reabonnementData = {
      utilisateurId: this.data.utilisateurId,
      ...this.reabonnementForm.getRawValue(),
    };

    console.log('Données réabonnement:', reabonnementData);

    this.abonnementService.reabonner(reabonnementData).subscribe({
      next: (response: any) => {
        console.log('Réabonnement créé:', response);
        this.isLoading = false;
        this.dialogRef.close({
          success: true,
          abonnement: response.abonnement
        });
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
        alert('Erreur: ' + (error.error?.message || error.message));
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }

}