import { Routes } from '@angular/router';
import { LoginComponent } from './components/utilisateur/auth/login/login/login.component';

export const routes: Routes = [
     { path: '', redirectTo: 'login/client', pathMatch: 'full' }, 
     { path: 'login/:role' , component: LoginComponent }

];
