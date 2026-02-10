import { Routes } from '@angular/router';
import { LoginComponent } from './components/utilisateur/auth/login/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { DashboardBoutiqueComponent } from './components/boutique/dashboard-boutique/dashboard-boutique.component';
import { ListeBoutiqueComponent } from './components/boutique/liste-boutique/liste-boutique.component';
import { MenuBoutiqueComponent } from './components/boutique/menu-boutique/menu-boutique.component';
import { ListUserComponent } from './components/admin/list-user/list-user.component';
import { ListBoxesComponent } from './components/admin/list-boxes/list-boxes.component';

export const routes: Routes = [
     { path: '', redirectTo: 'login/client', pathMatch: 'full' },
     { path: 'login/:role', component: LoginComponent },

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
               { path: 'liste_produit', component: ListeBoutiqueComponent }
          ]
     }

];
