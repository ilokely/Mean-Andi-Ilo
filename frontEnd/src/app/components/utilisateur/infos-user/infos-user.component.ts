import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-infos-user',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './infos-user.component.html',
  styleUrl: './infos-user.component.css'
})

export class InfosUserComponent implements OnInit {
  user: any = {};
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  userForm!: FormGroup;
  isLoading: boolean = false;


  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initForm();
      this.loadUser();
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.maxLength(10), Validators.minLength(10)]],
      role: [{ value: '', disabled: true }]
    });
  }

  loadUser(): void {
    const idUser = localStorage.getItem('userId');

    if (idUser) {
      this.utilisateurService.getUtilisateurById(idUser).subscribe(data => {
        this.user = data;

        // Mettre à jour le formulaire avec les données reçues
        this.userForm.patchValue({
          nom: this.user.nomUtilisateur,
          email: this.user.email,
          telephone: this.user.numero,
          role: this.user.role?.libelle
        });
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      console.log('Formulaire invalide');
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const idUser = localStorage.getItem('userId');

    if (idUser) {
      // Mapper les données du formulaire vers le format attendu par le backend
      const userAndUpdate = {
        nomUtilisateur: this.userForm.get('nom')?.value,
        email: this.userForm.get('email')?.value,
        numero: this.userForm.get('telephone')?.value
      };

      this.utilisateurService.updateInfosUtilisateur(idUser, userAndUpdate).subscribe({
        next: (response) => {
          this.user = response;
          this.isLoading = false;
          // Optionnel : Recharger les données complètes ou afficher un message de succès
          alert('Informations mises à jour avec succès');
        },
        error: (error) => {
          console.error(error);
          alert('Erreur lors de la mise à jour: ' + (error.error?.message || error.message));
          this.isLoading = false;
        }
      });
    }
  }
}
