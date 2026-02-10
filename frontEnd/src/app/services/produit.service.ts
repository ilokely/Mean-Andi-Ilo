import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class ProduitService {
    private apiUrl = `${environment.apiUrl}/produit`;

    constructor(private http: HttpClient) { }


    getProduits(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getProduits`);
    }

    getProduitsByBoutique(boutiqueId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getProduitsByBoutique/${boutiqueId}`);
    }

    addProduit(produitData: any): Observable<any> {
        return this.http.post<any>(
        `${this.apiUrl}/addProduit`,  // URL de l'endpoint
        produitData,                   // Corps de la requête (body)
        {
            headers: {
            'Content-Type': 'application/json'
            }
        }
        );
    }

  updateProduit(id: string, produitData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateProduit/${id}`, produitData);
  }

  deleteProduit(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteProduit/${id}`);
  }
  
}
