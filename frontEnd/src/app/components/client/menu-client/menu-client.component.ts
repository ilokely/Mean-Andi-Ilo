import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-menu-client',
  imports: [RouterModule],
  templateUrl: './menu-client.component.html',
  styleUrl: './menu-client.component.css'
})
export class MenuClientComponent {
   user: any = {};
  private platformId = inject(PLATFORM_ID);

  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.loadUser();
    }
  }

  loadUser(): void {
    const idUser = localStorage.getItem('userId');

    if (idUser) {
      this.utilisateurService.getUtilisateurById(idUser).subscribe(data => this.user = data);
    }
  }
}
