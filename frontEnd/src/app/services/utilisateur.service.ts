import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/utilisateur`;

  constructor(private http: HttpClient , private router: Router) { }

  login(email: string, motDePasse: string){
    return this.http.post(`${this.apiUrl}/login` , {email,motDePasse});
  }

  getUtilisateurById(id : string){
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUtilisateurRole(id : string){
    return this.http.get(`${this.apiUrl}/${id}/role`);
  }

  getAllUtilisateursNotAdmin(){
    return this.http.get(`${this.apiUrl}/notAdmin`);
  }

  getAllBoutiques(){
    return this.http.get(`${this.apiUrl}/boutique`);
  }

  getAllClients(){
    return this.http.get(`${this.apiUrl}/client`);
  }
}