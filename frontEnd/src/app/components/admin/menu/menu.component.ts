import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-menuAdmin',
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  user: any = {};

  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const idUser = localStorage.getItem('user');

    if (idUser) {
      this.utilisateurService.getUtilisateurById(idUser).subscribe(data => this.user = data);
    }
  }
}
