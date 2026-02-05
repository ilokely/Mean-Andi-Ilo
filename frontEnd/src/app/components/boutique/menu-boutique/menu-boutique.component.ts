import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-menu-boutique',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu-boutique.component.html',
  styleUrl: './menu-boutique.component.css'
})
export class MenuBoutiqueComponent {
  user: any = {};
  private platformId = inject(PLATFORM_ID);

  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUser();

    }
  }

  loadUser(): void {
    const idUser = localStorage.getItem('user');

    if (idUser) {
      this.utilisateurService.getUtilisateurById(idUser).subscribe(data => this.user = data);
    }
  }

  logout(): void {
    this.utilisateurService.logout();
  }
}
