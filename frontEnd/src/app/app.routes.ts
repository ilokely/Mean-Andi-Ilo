import { Routes } from '@angular/router';
import { LoginComponent } from './components/utilisateur/auth/login/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { DashboardBoutiqueComponent } from './components/boutique/dashboard-boutique/dashboard-boutique.component';

export const routes: Routes = [
     { path: '', redirectTo: 'login/client', pathMatch: 'full' }, 
     { path: 'login' , component: LoginComponent },
     { path: 'login/:role' , component: LoginComponent },

     { path: 'A_dashboard', component: DashboardComponent , data: { role: 'Admin' } },
     { path: 'B_dashboard', component: DashboardBoutiqueComponent , data: { role: 'Boutique' } }
     


];
