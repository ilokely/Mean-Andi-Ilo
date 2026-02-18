import { Component } from '@angular/core';
import { AAbonnementService } from '../../../services/a-abonnement.service';
import { ATypeAbonnementService } from '../../../services/a-type-abonnement.service';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-subscription',
  imports: [MenuComponent,FooterComponent,FormsModule, CommonModule],
  templateUrl: './list-subscription.component.html',
  styleUrl: './list-subscription.component.css'
})
export class ListSubscriptionComponent {
  abonnements: any[] = [];
  typeAbonnements: any[] = [];
  newType: any = { type: '', reduction: 0 };

  constructor(private aboService: AAbonnementService, private typeAboService: ATypeAbonnementService) { }

  ngOnInit(): void {
    this.loadAbonnements();
    this.loadTypeAbonnements();
  }

  loadAbonnements(): void {
    this.aboService.getAbonnements().subscribe(data => {
      this.abonnements = data as any[];
    });
  }

  loadTypeAbonnements(): void {
    this.typeAboService.getTypeAbonnements().subscribe(data => {
      this.typeAbonnements = data as any[];
    });
  }

  addTypeAbonnement(): void {
    if (!this.newType.type) return;

    this.typeAboService.addTypeAbonnement(this.newType).subscribe(res => {
      this.typeAbonnements.push(res);  // ajouter à la liste existante
      this.newType = { type: '', reduction: 0 };  // reset formulaire
    });
  }

  editTypeAbonnement(type: any): void {
  const newName = prompt('Modifier le nom du type', type.type);
  if (newName === null || newName.trim() === '') return;

  const newReductionStr = prompt('Modifier la réduction (%)', type.reduction.toString());
  if (newReductionStr === null) return;
  const newReduction = parseInt(newReductionStr, 10);
  if (isNaN(newReduction) || newReduction < 0 || newReduction > 100) {
    alert('La réduction doit être un nombre entre 0 et 100.');
    return;
  }

  type.type = newName.trim();
  type.reduction = newReduction;

  this.typeAboService.updateTypeAbonnement(type._id, type).subscribe({
    next: () => console.log('Type d’abonnement modifié avec succès'),
    error: err => console.error(err)
  });
}

  deleteTypeAbonnement(type: any): void {
    if (confirm(`Voulez-vous vraiment supprimer le type "${type.type}" ?`)) {
      this.typeAboService.deleteTypeAbonnement(type._id).subscribe(() => {
        this.typeAbonnements = this.typeAbonnements.filter(t => t._id !== type._id);
      });
    }
  }

}
