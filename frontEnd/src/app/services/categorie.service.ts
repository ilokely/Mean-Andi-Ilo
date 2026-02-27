import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = `${environment.apiUrl}/categorieProduit`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getCategories`);
  }

  addCategorie(categorie: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addCategorie`, categorie);
  }

  updateCategorie(categorieId: any, libelle: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateCategorie/${categorieId}`, { libelle });
  }

  deleteCategorie(categorieId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteCategorie/${categorieId}`);
  }
}
