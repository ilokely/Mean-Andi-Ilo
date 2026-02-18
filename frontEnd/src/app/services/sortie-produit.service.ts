import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SortieProduitService {
  private apiUrl = `${environment.apiUrl}/entreeProduit`;
    
  constructor(private http: HttpClient) { }

  getAllSortieProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllSortieProduits`);
  }

  getSortieProduitByBoutique(boutiqueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getSortieProduitByBoutique/${boutiqueId}`);
  }
}
