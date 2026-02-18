import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../../../../services/utilisateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-registration',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.css'
})
export class CustomerRegistrationComponent {
  newUser = {
    nomUtilisateur: '',
    email: '',
    numero: '',
    motDePasse: ''
  };

  constructor(private utilisateurService: UtilisateurService , private router: Router) { }

  inscrireClient(): void {
    this.utilisateurService.addClientUser(this.newUser).subscribe({
      next: (response) => {
      console.log('Inscription réussie :', response);
      this.router.navigate(['/login']);
      this.resetForm();
      },
      error: (error) => {
        console.error('Erreur complète :', error);
        if (error.status === 400 && error.error?.message) {
          alert(error.error.message); 
        } else {
          alert('Erreur serveur');
        }
      }
    });
  }

  resetForm(): void {
  this.newUser = {
    nomUtilisateur: '',
    email: '',
    numero: '',
    motDePasse: ''
  };
}
}
