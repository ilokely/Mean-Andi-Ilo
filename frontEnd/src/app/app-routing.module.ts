import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilAdminComponent } from './components/accueil-admin/accueil-admin.component';

const routes: Routes = [
  { path: 'accueil-admin', component:AccueilAdminComponent },
  { path: '', redirectTo: 'accueil-admin', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
