import { Component } from '@angular/core';
import { MenuClientComponent } from '../menu-client/menu-client.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { CommonModule } from '@angular/common';
import { SortieProduitService } from '../../../services/sortie-produit.service';

@Component({
  selector: 'app-historique-transaction',
  imports: [MenuClientComponent, FooterComponent, CommonModule],
  templateUrl: './historique-transaction.component.html',
  styleUrl: './historique-transaction.component.css'
})
export class HistoriqueTransactionComponent {
  historiqueTransactions: any[] = [];

  constructor(private SortieProduitService: SortieProduitService) { }

  ngOnInit(): void {
    this.loadHistoriqueTransactions();
  }

  loadHistoriqueTransactions(): void {
    this.SortieProduitService.getAllSortieProduits().subscribe(data => {
      console.log(data);
      this.historiqueTransactions = data as any[];
    });
  }
}
