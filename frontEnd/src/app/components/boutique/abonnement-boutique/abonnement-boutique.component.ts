import { Component, inject, PLATFORM_ID } from '@angular/core';
import { AAbonnementService } from '../../../services/a-abonnement.service';

@Component({
  selector: 'app-abonnement-boutique',
  imports: [],
  templateUrl: './abonnement-boutique.component.html',
  styleUrl: './abonnement-boutique.component.css'
})
export class AbonnementBoutiqueComponent {
  abonnement: any = {};
  user: any = {};

  private platformId = inject(PLATFORM_ID);

  constructor(private abonnementService: AAbonnementService) { }
}
