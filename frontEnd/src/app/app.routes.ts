import { Routes } from '@angular/router';
import { LoginComponent } from './components/utilisateur/auth/login/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { DashboardBoutiqueComponent } from './components/boutique/dashboard-boutique/dashboard-boutique.component';
import { ListeProduitComponent } from './components/boutique/liste-produit/liste-produit.component';
import { MenuBoutiqueComponent } from './components/boutique/menu-boutique/menu-boutique.component';
import { ListUserComponent } from './components/admin/list-user/list-user.component';
import { InfosUserComponent } from './components/utilisateur/infos-user/infos-user.component';
import { EntreeProduitComponent } from './components/boutique/entree-produit/entree-produit.component';
import { SortieProduitComponent } from './components/boutique/sortie-produit/sortie-produit.component';
import { ListBoxesComponent } from './components/admin/list-boxes/list-boxes.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
     { path: '', redirectTo: 'login/client', pathMatch: 'full' },
     { path: 'login/:role', component: LoginComponent },

     { path: 'A_dashboard', component: DashboardComponent, canActivate: [authGuard], data: { role: 'Admin' } },
     { path: 'A_listUser', component: ListUserComponent, canActivate: [authGuard], data: { role: 'Admin' } },
     { path: 'A_listUser', component: ListUserComponent, canActivate: [authGuard], data: { role: 'Admin' } },
     { path: 'A_listBoxes', component: ListBoxesComponent, canActivate: [authGuard], data: { role: 'Admin' } },

     {
          path: 'B_dashboard',
          component: MenuBoutiqueComponent,
          canActivate: [authGuard],
          data: { role: 'Boutique' },
          children: [
               { path: '', component: DashboardBoutiqueComponent }, // Default view: Dashboard content
               { path: 'liste_produit', component: ListeProduitComponent },
               { path: 'infos_user', component: InfosUserComponent } , 
               { path: 'entreeProduit', component: EntreeProduitComponent },
               { path: 'sortieProduit', component: SortieProduitComponent }
          ]
     }

];
