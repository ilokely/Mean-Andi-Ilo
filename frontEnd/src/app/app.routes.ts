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

export const routes: Routes = [
     { path: '', redirectTo: 'login/client', pathMatch: 'full' },
     { path: 'login/:role', component: LoginComponent },
     { path: 'login', component:LoginComponent },

     { path: 'A_dashboard', component: DashboardComponent, data: { role: 'Admin' } },
     { path: 'A_listUser', component: ListUserComponent, data: { role: 'Admin' } },
     { path: 'A_listUser', component: ListUserComponent, data: { role: 'Admin' } },
     { path: 'A_listBoxes', component: ListBoxesComponent, data: { role: 'Admin' } },

     {
          path: 'B_dashboard',
          component: MenuBoutiqueComponent, // Using Menu as the Layout 
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
