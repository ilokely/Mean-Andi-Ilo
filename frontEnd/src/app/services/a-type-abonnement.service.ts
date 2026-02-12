import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ATypeAbonnementService {
  private apiUrl = `${environment.apiUrl}/typeabo`;
  constructor(private http: HttpClient , private router: Router) { }

  getTypeAbonnements(){
    return this.http.get(`${this.apiUrl}`);
  }

  addTypeAbonnement(type: any){
    return this.http.post(`${this.apiUrl}`, type);
  }

  updateTypeAbonnement(id: string, type: any){
    return this.http.put(`${this.apiUrl}/${id}`, type);
  }

  deleteTypeAbonnement(id: string){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
