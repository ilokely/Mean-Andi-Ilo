import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

export interface DashboardStats {
  chiffreAffaires: number;
  benefices: number;
  nombreProduits: number;
  stockTotal: number;
  produitsRupture: number;
  produitsStockBas: number;
  ventesParJour: { date: string; montant: number; quantite: number }[];
  topProduits: { nom: string; ventes: number; montant: number }[];
  evolutionCA: { mois: string; montant: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardBoutiqueService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les statistiques
  getStats(boutiqueId: string): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/dashboardBoutique/stats/${boutiqueId}`
    );
  }

  // Récupérer les ventes par période
  getVentesByPeriod(boutiqueId: string, debut: Date, fin: Date): Observable<any> {
    return this.http.post(`${this.apiUrl}/dashboardBoutique/ventes-period`, {
      boutiqueId,
      debut,
      fin
    });
  }

}
