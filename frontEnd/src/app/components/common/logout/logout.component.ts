import { Component } from '@angular/core';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(private utilisateurService: UtilisateurService , private route: ActivatedRoute) {}

  ngOnInit() : void{
    this.utilisateurService.logout();
  }
}
