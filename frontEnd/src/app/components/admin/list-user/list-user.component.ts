import { Component } from '@angular/core';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../../common/footer/footer.component';

@Component({
  selector: 'app-list-user',
  imports: [MenuComponent , FooterComponent],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css'
})
export class ListUserComponent {
  boutiques: any[] = [];
  clients: any[] = [];

  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    this.loadBoutiques();
    this.loadClients();
  }

  loadBoutiques(): void {
    this.utilisateurService.getAllBoutiques().subscribe(data => {
      this.boutiques = data as any[];
    }); 
  }
  loadClients(): void {
    this.utilisateurService.getAllClients().subscribe(data => {
      this.clients = data as any[];
    });
  }
}
