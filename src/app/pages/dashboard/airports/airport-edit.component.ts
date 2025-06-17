import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AirportService } from '../../../services/airport.services';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';

@Component({
  selector: 'app-airport-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective, UiNavbarComponent],
  template: `
    <ui-navbar></ui-navbar>
    <div class="p-6 max-w-xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Modifier l'aéroport</h2>
      <form [formGroup]="airportForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label>Nom</label>
          <input class="border p-2 w-full" formControlName="name" />
        </div>
        <div class="mb-4">
          <label>IATA</label>
          <input class="border p-2 w-full uppercase" formControlName="iata" maxlength="3" />
        </div>
        <div class="mb-4">
          <label>Ville</label>
          <input class="border p-2 w-full" formControlName="city" />
        </div>
        <div class="mb-4">
          <label>Pays</label>
          <input class="border p-2 w-full" formControlName="country" />
        </div>
        <button hlmBtn type="submit" variant="outline" [disabled]="airportForm.invalid">Enregistrer</button>
        <button hlmBtn type="button" variant="destructive" (click)="cancel()" class="ml-2">Annuler</button>
      </form>
    </div>
  `
})
export class AirportEditComponent implements OnInit {
  airportForm: FormGroup;
  id: number;
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzUwNzg1NTU0fQ.YRdi-bHjk1T5pMJ_WYWwoJI1hDbLAKfmIQp-Ny-IZMo';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private airportService: AirportService,
    private router: Router
  ) {
    this.airportForm = this.fb.group({
      name: ['', Validators.required],
      iata: ['', [Validators.required, Validators.maxLength(3)]],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
    this.id = 0;
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.airportService.getAirport(this.token, this.id).subscribe((airport: any) => {
      this.airportForm.patchValue({
        name: airport.name,
        iata: airport.iata,
        city: airport.city,
        country: airport.country
      });
    });
  }

  onSubmit() {
    if (this.airportForm.invalid) return;
    const airportData = {
      ...this.airportForm.value,
      iata: this.airportForm.value.iata?.toUpperCase() || ''
    };
    this.airportService.updateAirport(this.token, this.id, airportData).subscribe(() => {
      this.router.navigate(['/dashboard/airports']);
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/airports']);
  }
}
