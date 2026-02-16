import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../../../../services/utilisateur.service';
import { ActivatedRoute } from '@angular/router';
import { ABoxService } from '../../../../../services/a-box.service';
import { ATypeAbonnementService } from '../../../../../services/a-type-abonnement.service';
import { AAbonnementService } from '../../../../../services/a-abonnement.service';

@Component({
  selector: 'app-store-registration',
  imports: [CommonModule, FormsModule],
  templateUrl: './store-registration.component.html',
  styleUrl: './store-registration.component.css'
})
export class StoreRegistrationComponent {
  nomUtilisateur = '';
  email = '';
  numero = '';
  mdp = '';

  boxes: any[] = [];
  boxSelectionne: any = {};
  dataBoxSelectionne: any = {};

  typesAbonnement: any[] = [];
  typeAbonnementSelectionne: any = {};
  abonnementSelectionne: any = {};

  dateDebut: Date | null = null;
  dateDebutMin: string = '';



  constructor(private utilisateurService: UtilisateurService, private boxService: ABoxService, private typeAbonnementService: ATypeAbonnementService, private aboService: AAbonnementService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadBoxes();
    this.loadTypesAbonnement();

    const today = new Date();
    let demain = new Date(today);
    demain.setDate(today.getDate() + 1); // demain

    // Si demain est dimanche
    if (demain.getDay() === 0) {
      // on décale au lundi
      demain.setDate(demain.getDate() + 1);
    }

    // Formater en yyyy-MM-dd pour input[type="date"]
    const yyyy = demain.getFullYear();
    const mm = String(demain.getMonth() + 1).padStart(2, '0');
    const dd = String(demain.getDate()).padStart(2, '0');

    this.dateDebutMin = `${yyyy}-${mm}-${dd}`;
  }

  loadBoxes(): void {
    this.boxService.getFreeBoxes().subscribe(data => {
      console.log(data);
      this.boxes = data as any[];
    });
  }

  loadTypesAbonnement(): void {
    this.typeAbonnementService.getTypeAbonnements().subscribe(data => {
      console.log(data);
      this.typesAbonnement = data as any[];
    });
  }

  inscrireBoutique(): void {
    if (!this.boxSelectionne || !this.abonnementSelectionne || !this.dateDebut) {
      alert('Veuillez sélectionner une box, un type d\'abonnement et une date de début.');
      return;
    }

    this.utilisateurService.addBoutiqueUser({
      nomUtilisateur: this.nomUtilisateur,
      email: this.email,
      numero: this.numero,
      motDePasse: this.mdp
    }).subscribe({
      next: (userData: any) => {

        this.boxService.getById(this.boxSelectionne).subscribe((boxData: any) => {

          this.typeAbonnementService.getById(this.abonnementSelectionne).subscribe((typeData: any) => {

            const prixFinal = boxData.prix - (boxData.prix * typeData.reduction / 100);

            const abonnement = {
              utilisateur: userData._id,
              box: this.boxSelectionne,
              typeAbonnement: this.abonnementSelectionne,
              dateDebut: this.dateDebut,
              prix: prixFinal
            };

            console.log('Abonnement à créer :', abonnement);

            this.aboService.addAbonnement(abonnement).subscribe({
              next: () => {
                alert('Inscription boutique réussie !');

                this.nomUtilisateur = '';
                this.email = '';
                this.numero = '';
                this.mdp = '';

                this.boxSelectionne = null;
                this.abonnementSelectionne = null;
                this.typeAbonnementSelectionne = null;

                this.dateDebut = null;

                this.loadBoxes();
                this.loadTypesAbonnement();

              },
              error: (err) => alert('Erreur création abonnement')
            });
          });
        });
      }
    });

  }

  getBoxById(id: string): any {
    this.boxService.getById(id).subscribe(data => this.dataBoxSelectionne = data);
  }

}