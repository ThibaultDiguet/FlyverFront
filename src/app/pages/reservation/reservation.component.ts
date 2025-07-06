import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiNavbarComponent } from '../../components/ui/ui-navbar/ui-navbar.component';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.services';
import { HttpClient } from '@angular/common/http';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../../services/reservation.services';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  imports: [
    CommonModule,
    UiNavbarComponent,
    ReactiveFormsModule,
    HlmButtonDirective
  ],
})
export class ReservationComponent {
  reservationForm: FormGroup;
  flights: any[] = [];
  submitting = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
  ) {
    this.reservationForm = this.fb.group({
      flight_id: ['', Validators.required],
      passengers: this.fb.array([]),
      nb_passengers: [1, [Validators.required, Validators.min(1)]]
    });
    this.addPassengers(1);
    this.loadFlights();

    const flightId = this.route.snapshot.paramMap.get('flightId');
    if (flightId) {
      this.reservationForm.patchValue({ flight_id: flightId });
    }
  }

  get passengers(): FormArray {
    return this.reservationForm.get('passengers') as FormArray;
  }

  goToMyReservations() {
    this.router.navigate(['/reservation/mes-reservations']);
  }

  addPassengers(count: number) {
    this.passengers.clear();
    for (let i = 0; i < count; i++) {
      this.passengers.push(this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        birth_date: ['', Validators.required],
        nationality: ['', Validators.required],
      }));
    }
  }

  onNbPassengersChange() {
    const nb = this.reservationForm.value.nb_passengers || 1;
    this.addPassengers(nb);
  }

  loadFlights() {
    this.flightService.getFlights('').subscribe({
      next: (flights) => {
        this.flights = Array.isArray(flights) ? flights : (flights.flights || []);
      }
    });
  }

  async onSubmit() {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.reservationForm.invalid) return;
    this.submitting = true;
    const flight_id = Number(this.reservationForm.value.flight_id);
    const passengers = this.reservationForm.value.passengers;

    const token = localStorage.getItem('refresh_token') || '';

    try {
      await Promise.all(passengers.map(async (p: any, idx: number) => {
        const passengerRes = await firstValueFrom(this.http.post<any>('http://localhost:8000/passengers/', p, {
          headers: { Authorization: `Bearer ${token}` }
        }));
        const passenger_id = passengerRes.id_passenger ?? passengerRes.id ?? passengerRes.passenger_id;
        if (!passenger_id) throw new Error('ID passager manquant');
        await firstValueFrom(
          this.reservationService.createReservation(token, { flight_id, passenger_id })
        );
      }));
      this.successMsg = 'Réservation effectuée avec succès !';
      this.reservationForm.reset({ nb_passengers: 1 });
      this.addPassengers(1);
    } catch (err: any) {
      this.errorMsg = 'Erreur lors de la réservation. Détail: ' + (err?.message || err);
      console.error('Erreur globale:', err);
    } finally {
      this.submitting = false;
    }
  }
}
