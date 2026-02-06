import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ProduitService } from '../../../services/produit.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddProduitDialogComponent } from './add-produit-dialog/add-produit-dialog.component';

@Component({
  selector: 'app-liste-boutique',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './liste-boutique.component.html',
  styleUrl: './liste-boutique.component.css'
})
export class ListeBoutiqueComponent implements OnInit {
  produits: any[] = [];
  readonly dialog = inject(MatDialog);
  
  constructor(private produitService: ProduitService) { }

  openDialog() {
    this.dialog.open(AddProduitDialogComponent);
  }
  
  ngOnInit(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
        // console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
}
