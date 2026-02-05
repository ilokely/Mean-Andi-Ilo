import { Component } from '@angular/core';
import { MenuBoutiqueComponent } from '../menu-boutique/menu-boutique.component';

@Component({
  selector: 'app-dashboard-boutique',
  standalone:true,
  imports: [MenuBoutiqueComponent],
  templateUrl: './dashboard-boutique.component.html',
  styleUrl: './dashboard-boutique.component.css'
})
export class DashboardBoutiqueComponent {

}
