import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AAbonnementService {
  private apiUrl = `${environment.apiUrl}/abonnement`;

  constructor(private http: HttpClient , private router: Router ) { }

  getAbonnements(){
    return this.http.get(`${this.apiUrl}`);
  }
}
