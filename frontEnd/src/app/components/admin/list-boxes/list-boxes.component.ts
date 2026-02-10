import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { ABoxService } from '../../../services/a-box.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-list-boxes',
  imports: [MenuComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './list-boxes.component.html',
  styleUrl: './list-boxes.component.css'
})
export class ListBoxesComponent {
  busyBoxes: any[] = [];
  freeBoxes: any[] = [];
  newBox = {
    nom: '',
    surface: 0,
    etage: 0,
    prix: 0,
    isAvailable: true
  };
  selectedBox: any = null;
  editBoxData = {
    _id: '',
    nom: '',
    etage: 0,
    surface: 0,
    prix: 0,
    isAvailable: true
  };

  constructor(private boxService: ABoxService) { }
  ngOnInit(): void {
    this.loadBusyBoxes();
    this.loadFreeBoxes();
  }

  loadBusyBoxes(): void {
    this.boxService.getBusyBoxes().subscribe(data => {
      // console.log(data);
      this.busyBoxes = data as any[];
    });
  }

  loadFreeBoxes(): void {
    this.boxService.getFreeBoxes().subscribe(data => {
      // console.log(data);
      this.freeBoxes = data as any[];
    });
  }

  addBox(): void {
    if (!this.newBox.nom || !this.newBox.surface || !this.newBox.etage || !this.newBox.prix) {
      return;
    }

    this.boxService.createBox(this.newBox).subscribe({
      next: () => {
        this.loadBusyBoxes();
        this.loadFreeBoxes();
        this.resetForm();

        // 🔒 fermer le modal Ajouter
        const modalEl = document.getElementById('verticalycentered');
        const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
        modal.hide();
      },
      error: err => console.error(err)
    });
  }

  editBox(box: any): void {
    this.editBoxData = { ...box };
    // console.log(this.editBoxData._id);
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('editBoxModal')
    );
    modal.show();
  }
  
  updateBox(): void {
    if (this.editBoxData.nom && this.editBoxData.surface && this.editBoxData.etage && this.editBoxData.prix) {
      this.boxService.updateBox(this.editBoxData._id, this.editBoxData).subscribe({
        next: (data) => {
          console.log(data);
          this.loadBusyBoxes();
          this.loadFreeBoxes();
          const modalEl = document.getElementById('editBoxModal');
          const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
          modal.hide();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  deleteBox(box: any): void {
    this.selectedBox = box;

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('deleteBoxModal')
    );
    modal.show();
  }

  confirmDelete(): void {
    if (!this.selectedBox) return;

    this.boxService.deleteBox(this.selectedBox._id)
      .subscribe({
        next: () => {
          this.loadBusyBoxes();
          this.loadFreeBoxes();

          const modalEl = document.getElementById('deleteBoxModal');
          const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
          modal.hide();
        },
        error: err => console.error(err)
      });
  }

  resetForm(): void {
    this.newBox = {
      nom: '',
      surface: 0,
      etage: 0,
      prix: 0,
      isAvailable: true
    };
  }
}
