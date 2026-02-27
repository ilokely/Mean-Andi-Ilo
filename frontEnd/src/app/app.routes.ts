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
import { AccueilComponent } from './components/client/accueil/accueil.component';
import { LogoutComponent } from './components/common/logout/logout.component';
import { ListSubscriptionComponent } from './components/admin/list-subscription/list-subscription.component';
import { StoreRegistrationComponent } from './components/utilisateur/auth/registration/store-registration/store-registration.component';
import { CustomerRegistrationComponent } from './components/utilisateur/auth/registration/customer-registration/customer-registration.component';
import { HistoriqueTransactionComponent } from './components/client/historique-transaction/historique-transaction.component';
import { AbonnementBoutiqueComponent } from './components/boutique/abonnement-boutique/abonnement-boutique.component';
import { TypeAbonnementComponent } from './components/admin/type-abonnement/type-abonnement.component';
import { CategorieProduitComponent } from './components/admin/categorie-produit/categorie-produit.component';

export const routes: Routes = [
     { path: '', redirectTo: 'login/client', pathMatch: 'full' },
     { path: 'login/:role', component: LoginComponent },
     { path: 'login', component:LoginComponent },
     { path: 'creer_compte_boutique' , component: StoreRegistrationComponent },
     { path : 'creer_compte_client' , component: CustomerRegistrationComponent },
     { path: 'logout', component: LogoutComponent },


     { path: 'A_dashboard', component: DashboardComponent, canActivate: [authGuard], data: { role: 'Admin' } },
     { path: 'A_listUser', component: ListUserComponent, canActivate: [authGuard], data: { role: 'Admin' } },
     { path: 'A_listUser', component: ListUserComponent, canActivate: [authGuard], data: { role: 'Admin' } },
     { path: 'A_listBoxes', component: ListBoxesComponent, canActivate: [authGuard], data: { role: 'Admin' } },
     { path: 'A_listSubscription', component: ListSubscriptionComponent, canActivate: [authGuard], data: { role: 'Admin' } },
     { path: 'A_Categories', component: CategorieProduitComponent, canActivate: [authGuard], data: { role: 'Admin' } },
     { path: 'A_TypeAbonnement', component: TypeAbonnementComponent, canActivate: [authGuard], data: { role: 'Admin' } },

     { path: 'C_accueil' , component: AccueilComponent, canActivate: [authGuard], data: { role: 'Client' } },
     { path: 'C_historique_transaction' , component: HistoriqueTransactionComponent, canActivate: [authGuard], data: { role: 'Client' } },

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
               { path: 'sortieProduit', component: SortieProduitComponent },
               { path: 'abonnement-boutique', component: AbonnementBoutiqueComponent }
          ]
     }

];
