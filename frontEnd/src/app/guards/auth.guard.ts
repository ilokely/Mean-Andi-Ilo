import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UtilisateurService } from '../services/utilisateur.service';

export const authGuard: CanActivateFn = async (route, state) => {

  const router = inject(Router);
  const utilisateurService = inject(UtilisateurService);

  const userId = localStorage.getItem('userId');

  // Pas connecté
  if (!userId) {
    router.navigate(['/login/client']);
    return false;
  }

  try {
    const role = await firstValueFrom(
      utilisateurService.getUtilisateurRole(userId)
    );
    console.log('Rôle récupéré :', role);

    const expectedRole = route.data?.['role'];
    console.log('Rôle attendu :', expectedRole);

    // Si le rôle correspond à celui attendu dans la route
    if (!expectedRole || role === expectedRole) {
      return true;
    }

    // Mauvais rôle → redirection selon ton switch
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