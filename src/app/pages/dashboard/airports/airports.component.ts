import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportService } from '../../../services/airport.services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-airports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective, UiNavbarComponent],
  templateUrl: './airports.component.html'
})
export class DashboardAirportsComponent implements OnInit {
  airports: any[] = [];
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzUwNzg1NTU0fQ.YRdi-bHjk1T5pMJ_WYWwoJI1hDbLAKfmIQp-Ny-IZMo';
  airportForm: FormGroup;

  constructor(
    private airportService: AirportService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.airportForm = this.fb.group({
      name: [''],
      iata: [''],
      city: [''],
      country: ['']
    });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.airportService.getAirports(this.token).subscribe({
      next: (res) => {
        this.airports = Array.isArray(res) ? res : (res.airports || (res.airport ? [res.airport] : []));
      },
      error: () => {
        this.airports = [];
      }
    });
  }

  onSubmit() {
    if (this.airportForm.invalid) return;
    const airportData = {
      ...this.airportForm.value,
      iata: this.airportForm.value.iata?.toUpperCase() || ''
    };
    console.log(airportData);
    this.airportService.createAirport(this.token, airportData)
      .subscribe(() => {
        this.refresh();
        this.airportForm.reset();
      });
  }

  edit(airport: any) {
    this.router.navigate(['/dashboard/airports/edit', airport.id_airport]);
  }

  delete(airport: any) {
    if (!airport) return;
    this.airportService.deleteAirport(this.token, airport.id_airport)
      .subscribe(() => this.refresh());
  }
}
