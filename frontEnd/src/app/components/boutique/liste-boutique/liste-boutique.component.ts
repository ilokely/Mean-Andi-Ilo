import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../../../services/produit.service';

@Component({
  selector: 'app-liste-boutique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-boutique.component.html',
  styleUrl: './liste-boutique.component.css'
})
export class ListeBoutiqueComponent implements OnInit {
  produits: any[] = [];

  constructor(private produitService: ProduitService) { }

  ngOnInit(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: (e) => console.error(e)
    });
  }
}
