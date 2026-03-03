import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntreeProduitService {
  private apiUrl = `${environment.apiUrl}/entreeProduit`;

  constructor(private http: HttpClient) { }

  getEntreeProduit(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getEntreeProduits`);
  }

  getEntreeProduitByBoutique(boutiqueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getStockByBoutique/${boutiqueId}`);
  }

  addEntreeProduit(entreeProduit: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addEntreeProduit`, entreeProduit);
  }
}
