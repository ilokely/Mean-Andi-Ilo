import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AAbonnementService {
  private apiUrl = `${environment.apiUrl}/abonnement`;

  constructor(private http: HttpClient , private router: Router ) { }

  getAbonnements(){
    return this.http.get(`${this.apiUrl}`);
  }

  addAbonnement(abonnement: any) {
    return this.http.post(`${this.apiUrl}/add`, abonnement);
  }

  getAbonnementByBoutique(boutiqueId: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/getAbonnementByBoutique/${boutiqueId}`);
  }

  reabonner(abonnement: any) {
    return this.http.post(`${this.apiUrl}/reabonner`, abonnement);
  }
}
