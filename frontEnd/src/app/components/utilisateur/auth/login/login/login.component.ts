import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../../../../services/utilisateur.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  role = '';
  email = '';
  motDePasse = '';

  constructor(private utilisateurService: UtilisateurService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {
    this.role = this.route.snapshot.params['role'];
    if (this.role === 'client') {
      this.email = 'client@example.com';
      this.motDePasse = '1234';

    }
    if (this.role === 'boutique') {
      this.email = 'boutique@example.com';
      this.motDePasse = '1234';

    }
    if (this.role === 'admin') {
      this.email = 'Admin@gmail.com';
      this.motDePasse = '1234';
    }
  }

  login(): void {
    this.utilisateurService.login(this.email, this.motDePasse).subscribe({
      next: (res: any) => {
        console.log('Connexion réussie !', res);
        // Exemple : enregistrer le token ou l'utilisateur dans le localStorage
        if(res.user._id) {
          localStorage.setItem('user', res.user._id);
        }
        const role = res.user.role.libelle;
        switch(role){
          case 'Client':
            this.router.navigate(['']);
            break;
          case 'Boutique':
            this.router.navigate(['']);
            break;
          case 'Admin':
            this.router.navigate(['']);
            break;
          default:
            this.router.navigate(['']);
        }
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        alert('Email ou mot de passe incorrect !');
      }
    });
  }
}