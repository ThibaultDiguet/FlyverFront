import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../../services/flight.services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-dashboard-flights',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective, UiNavbarComponent],
  templateUrl: './flights.component.html'
})
export class DashboardFlightsComponent implements OnInit {
  flights: any[] = [];
  token: string = '';
  flightForm: FormGroup;

  constructor(
    private flightService: FlightService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.flightForm = this.fb.group({
      plane_id: [''],
      departure_airport_id: [''],
      arrival_airport_id: [''],
      departure_time: [''],
      arrival_time: [''],
    });
  }

  ngOnInit() {
    this.token = this.localStorageService.getItem('refresh_token') || '';
    this.refresh();
  }

  refresh() {
    this.flightService.getFlights(this.token).subscribe({
      next: (res) => {
        this.flights = Array.isArray(res) ? res : (res.flights || []);
      },
      error: () => {
        this.flights = [];
      }
    });
  }

  onSubmit() {
    if (this.flightForm.invalid) return;
    const flightData = this.flightForm.value;
    this.flightService.createFlight(this.token, flightData)
      .subscribe(() => {
        this.refresh();
        this.flightForm.reset();
      });
  }

  edit(flight: any) {
    this.router.navigate(['/dashboard/flights/edit', flight.id_flight]);
  }

  delete(flight: any) {
    if (!flight) return;
    this.flightService.deleteFlight(this.token, flight.id_flight)
      .subscribe(() => this.refresh());
  }
}
