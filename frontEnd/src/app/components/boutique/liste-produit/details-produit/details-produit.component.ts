import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
// import { ImageUrlPipe } from '../../../../pipes/image-url.pipe';

@Component({
  selector: 'app-details-produit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    // ImageUrlPipe
  ],
  templateUrl: './details-produit.component.html',
  styleUrl: './details-produit.component.css'
})
export class DetailsProduitComponent {
  @Input() produit: any;
  
  // Événements pour communiquer avec le parent
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onClose(): void {
    this.close.emit();
  }

  onEdit(): void {
    this.edit.emit(this.produit);
  }

  onDelete(): void {
    this.delete.emit(this.produit);
  }

  get marge(): number {
    return this.produit.prixVente - this.produit.prixAchat;
  }

  get margePercentage(): number {
    return ((this.marge / this.produit.prixAchat) * 100);
  }
}