import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../../services/flight.services';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import {LocalStorageService} from '../../../services/local-storage.service';

@Component({
  selector: 'app-flight-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective, UiNavbarComponent],
  template: `
    <ui-navbar></ui-navbar>
    <div class="p-6 max-w-xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Modifier le vol</h2>
      <form [formGroup]="flightForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label>Numéro</label>
          <input class="border p-2 w-full" formControlName="plane_id" />
        </div>
        <div class="mb-4">
          <label>ID aéroport départ</label>
          <input class="border p-2 w-full" formControlName="departure_airport_id" />
        </div>
        <div class="mb-4">
          <label>ID aéroport arrivée</label>
          <input class="border p-2 w-full" formControlName="arrival_airport_id" />
        </div>
        <div class="mb-4">
          <label>Départ</label>
          <input class="border p-2 w-full" type="datetime-local" formControlName="departure_time" />
        </div>
        <div class="mb-4">
          <label>Arrivée</label>
          <input class="border p-2 w-full" type="datetime-local" formControlName="arrival_time" />
        </div>
        <button hlmBtn type="submit" variant="outline" [disabled]="flightForm.invalid">Enregistrer</button>
        <button hlmBtn type="button" variant="destructive" (click)="cancel()" class="ml-2">Annuler</button>
      </form>
    </div>
  `
})
export class FlightEditComponent implements OnInit {
  flightForm: FormGroup;
  id: number;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private flightService: FlightService,
    private router: Router
  ) {
    this.flightForm = this.fb.group({
      plane_id: ['', Validators.required],
      departure_airport_id: ['', Validators.required],
      arrival_airport_id: ['', Validators.required],
      departure_time: ['', Validators.required],
      arrival_time: ['', Validators.required],
    });
    this.id = 0;
  }

  ngOnInit() {
    this.token = this.localStorageService.getItem('refresh_token') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.flightService.getFlight(this.token, this.id).subscribe((flight: any) => {
      this.flightForm.patchValue({
        plane_id: flight.plane_id,
        departure_airport_id: flight.departure_airport_id,
        arrival_airport_id: flight.arrival_airport_id,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
      });
    });
  }

  onSubmit() {
    if (this.flightForm.invalid) return;
    const flightData = this.flightForm.value;
    this.flightService.updateFlight(this.token, this.id, flightData).subscribe(() => {
      this.router.navigate(['/dashboard/flights']);
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/flights']);
  }
}
