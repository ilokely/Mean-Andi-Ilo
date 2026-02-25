import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardAdminService {
  private apiUrl = `${environment.apiUrl}/dashboardAdmin`;

  constructor(private http: HttpClient) { }

  getNbFreeBoxes() {
    return this.http.get(`${this.apiUrl}/available/count`);
  }

  getNbUnavailableBoxes() {
    return this.http.get(`${this.apiUrl}/unavailable/count`);
  }

  getNbActiveAbonnements() {
    return this.http.get(`${this.apiUrl}/count/actifs`);
  }

  getNbTerminedAbonnements() {
    return this.http.get(`${this.apiUrl}/count/termines`);
  }

  getCAMois() {
    return this.http.get(`${this.apiUrl}/ca/mois`);
  }

getStatCaMois() {
  return this.http.get<any[]>(`${this.apiUrl}/stat/caMensuel`);
}

getStatTypesPlusUtilise() {
  return this.http.get<any>(`${this.apiUrl}/stat/typePlusUtilise`);
}

}
