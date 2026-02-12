import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UtilisateurService } from '../services/utilisateur.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const utilisateurService = inject(UtilisateurService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    // On est côté serveur → on bloque l'accès ou retourne true pour SSR
    return false;
  }

  const userId = localStorage.getItem('userId');

  if (!userId) {
    router.navigate(['/login/client']);
    return false;
  }

  try {
    const role = await firstValueFrom(
      utilisateurService.getUtilisateurRole(userId)
    );

    const expectedRole = route.data?.['role'];

    if (!expectedRole || role === expectedRole) {
      return true;
    }

    switch (role) {
      case 'Client':
        router.navigate(['']);
        break;
      case 'Boutique':
        router.navigate(['/B_dashboard']);
        break;
      case 'Admin':
        router.navigate(['/A_dashboard']);
        break;
      default:
        router.navigate(['/login/client']);
    }

    return false;

  } catch (error) {
    console.error('Erreur récupération rôle', error);
    router.navigate(['/login/client']);
    return false;
  }
};