import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { FooterComponent } from '../../common/footer/footer.component';
import { DashboardAdminService } from '../../../services/dashboard-admin.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [MenuComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  nbFreeBoxes: number = 0;
  nbUnavailableBoxes: number = 0;
  nbActiveAbonnements: number = 0;
  nbTerminedAbonnements: number = 0;
  chiffreAffaires: number = 0;

  constructor(private dashboardAdminService: DashboardAdminService) { }

  ngOnInit() {
    this.loadnbFreeBoxes();
    this.loadnbUnavailableBoxes();
    this.loadnbActiveAbonnements();
    this.loadnbTerminedAbonnements();
    this.loadCAMois();
    this.loadCaMensuelChart();
  }

  ngAfterViewInit() {
    this.loadTypesPlusUtiliseChart();
  }

  loadnbFreeBoxes() {
    this.dashboardAdminService.getNbFreeBoxes().subscribe((count: any) => {
      this.nbFreeBoxes = count.count;
    });
  }

  loadnbUnavailableBoxes() {
    this.dashboardAdminService.getNbUnavailableBoxes().subscribe((count: any) => {
      this.nbUnavailableBoxes = count.count;
    });
  }

  loadnbActiveAbonnements() {
    this.dashboardAdminService.getNbActiveAbonnements().subscribe((count: any) => {
      this.nbActiveAbonnements = count.count;
    });
  }

  loadnbTerminedAbonnements() {
    this.dashboardAdminService.getNbTerminedAbonnements().subscribe((count: any) => {
      this.nbTerminedAbonnements = count.count;
    });
  }

  loadCAMois() {
    this.dashboardAdminService.getCAMois().subscribe((ca: any) => {
      this.chiffreAffaires = ca.moyenneMensuelle;
      console.log('Chiffre d\'affaires par mois:', this.chiffreAffaires);
    });
  }

  loadCaMensuelChart() {
    this.dashboardAdminService.getStatCaMois().subscribe(data => {

      const labels = data.map((d: any) => d.mois);
      const values = data.map((d: any) => d.total);

      new Chart("caChart", {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Chiffre d\'affaire mensuel',
            data: values,
            borderWidth: 2,
            tension: 0.3
          }]
        }
      });

    });
  }

  // 🥧 PIE CHART - Répartition Types
  loadTypesPlusUtiliseChart() {

    this.dashboardAdminService.getStatTypesPlusUtilise().subscribe((data: any[]) => {

      const labels = data.map(d => d._id);
      const values = data.map(d => d.total);

      new Chart("typeChart", {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });

    });

  }
}
