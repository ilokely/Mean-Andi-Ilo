import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardBoutiqueService, DashboardStats } from '../../../services/dashboard-boutique.service';
import { StorageService } from '../../../services/storage.service';

import {
  Chart,
  ChartConfiguration,
  ChartType,
  // Contrôleurs (IMPORTANT !)
  LineController,
  BarController,
  // Échelles
  CategoryScale,
  LinearScale,
  // Éléments
  PointElement,
  LineElement,
  BarElement,
  // Plugins
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

Chart.register(
  // Contrôleurs
  LineController,
  BarController,
  // Échelles
  CategoryScale,
  LinearScale,
  // Éléments
  PointElement,
  LineElement,
  BarElement,
  // Plugins
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-dashboard-boutique',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    BaseChartDirective,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './dashboard-boutique.component.html',
  styleUrl: './dashboard-boutique.component.css'
})
export class DashboardBoutiqueComponent implements OnInit {
  private dashboardBoutiqueService = inject(DashboardBoutiqueService);
  private storageService = inject(StorageService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  stats: DashboardStats | null = null;
  isLoading: boolean = true;

  // Configuration du graphique des ventes
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' €';
          }
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  // Configuration du graphique des top produits
  public barChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.parsed.x + ' €';
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' €';
          }
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStats();
    }
  }

  loadStats(): void {
    const boutiqueId = this.storageService.getItem('userId');
    
    if (!boutiqueId) {
      console.error('Boutique ID not found');
      this.isLoading = false;
      return;
    }

    this.dashboardBoutiqueService.getStats(boutiqueId).subscribe({
      next: (data) => {
        this.stats = data;
        this.prepareCharts();
        this.cdr.detectChanges();
        this.isLoading = false;
        console.log('Stats chargées:', data);
      },
      error: (error) => {
        console.error('Erreur chargement stats:', error);
        this.isLoading = false;
      }
    });
  }

  // Préparer les données des graphiques
  prepareCharts(): void {
    if (!this.stats) return;

    // Graphique des ventes par jour
    this.lineChartData = {
      labels: this.stats.ventesParJour.map(v => {
        const date = new Date(v.date);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      }),
      datasets: [
        {
          data: this.stats.ventesParJour.map(v => v.montant),
          label: 'Chiffre d\'affaires (€)',
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          data: this.stats.ventesParJour.map(v => v.quantite),
          label: 'Quantité vendue',
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };

    // Graphique des top produits
    this.barChartData = {
      labels: this.stats.topProduits.map(p => p.nom),
      datasets: [
        {
          data: this.stats.topProduits.map(p => p.montant),
          label: 'Chiffre d\'affaires',
          backgroundColor: [
            '#1976d2',
            '#4caf50',
            '#ff9800',
            '#f44336',
            '#9c27b0'
          ]
        }
      ]
    };
  }

  // Calculer le taux de marge
  get tauxMarge(): number {
    if (!this.stats || this.stats.chiffreAffaires === 0) return 0;
    return (this.stats.benefices / this.stats.chiffreAffaires) * 100;
  }

  // Calculer la valeur moyenne du panier
  get panierMoyen(): number {
    if (!this.stats || this.stats.ventesParJour.length === 0) return 0;
    const totalVentes = this.stats.ventesParJour.reduce((sum, v) => sum + v.quantite, 0);
    if (totalVentes === 0) return 0;
    return this.stats.chiffreAffaires / totalVentes;
  }
}