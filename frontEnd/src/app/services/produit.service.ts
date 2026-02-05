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
}
