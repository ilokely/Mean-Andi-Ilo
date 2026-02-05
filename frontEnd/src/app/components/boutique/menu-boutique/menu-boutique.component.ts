import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, HostListener } from '@angular/core';
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
  private document = inject(DOCUMENT);

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

  toggleSearchBar(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.querySelector('.search-bar')?.classList.toggle('search-bar-show');
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const selectHeader = this.document.querySelector('#header');
      if (selectHeader) {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled');
        } else {
          selectHeader.classList.remove('header-scrolled');
        }
      }
    }
  }
}
