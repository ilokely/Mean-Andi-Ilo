import { Routes } from '@angular/router';
import { LoginComponent } from './components/utilisateur/auth/login/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';

export const routes: Routes = [
     { path: '', redirectTo: 'login/client', pathMatch: 'full' }, 
     { path: 'login/:role' , component: LoginComponent },

     { path: 'A_dashboard', component: DashboardComponent , data: { role: 'Admin' } },
];
