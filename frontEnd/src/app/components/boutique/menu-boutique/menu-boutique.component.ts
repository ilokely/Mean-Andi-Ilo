import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { StorageService } from '../../../services/storage.service';
import { Subscription } from 'rxjs';

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
  private storageService = inject(StorageService);

  private userSubscription?: Subscription;

  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUser();
      this.subscribeToUserChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // S'abonner aux changements de l'utilisateur
  subscribeToUserChanges(): void {
    this.userSubscription = this.utilisateurService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          console.log('Utilisateur mis à jour dans le menu:', user);
          this.user = user;
        }
      }
    });
  }

  loadUser(): void {
    const idUser = this.storageService.getItem('userId');

    if (idUser) {
      this.utilisateurService.getUtilisateurById(idUser).subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (error) => {
          console.error('Erreur chargement utilisateur:', error);
        }
      });
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

  toggleSidebar() {
  document.body.classList.toggle('toggle-sidebar');
}
}
