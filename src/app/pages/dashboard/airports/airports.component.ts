import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportService } from '../../../services/airport.services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';


@Component({
  selector: 'app-dashboard-airports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective],
  templateUrl: './airports.component.html'
})
export class DashboardAirportsComponent implements OnInit {
  airports: any[] = [];
  token = 'TOKEN_ICI'; // Remplace par le vrai token
  airportForm: FormGroup;
  editMode = false;
  editingId: number | null = null;

  constructor(
    private airportService: AirportService,
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
        this.airports = res.airports || (res.airport ? [res.airport] : []);
      },
      error: () => {
        this.airports = [];
      }
    });
  }

  onSubmit() {
    if (this.airportForm.invalid) return;
    const airportData = this.airportForm.value;
    if (this.editMode && this.editingId !== null) {
      this.airportService.updateAirport(this.token, this.editingId, airportData)
        .subscribe(() => {
          this.refresh();
          this.cancelEdit();
        });
    } else {
      this.airportService.createAirport(this.token, airportData)
        .subscribe(() => {
          this.refresh();
          this.airportForm.reset();
        });
    }
  }

  edit(airport: any) {
    this.editMode = true;
    this.editingId = airport.id_airport;
    this.airportForm.patchValue({
      name: airport.name,
      iata: airport.iata,
      city: airport.city,
      country: airport.country
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.editingId = null;
    this.airportForm.reset();
  }

  delete(airport: any) {
    if (!airport) return;
    this.airportService.deleteAirport(this.token, airport.id_airport)
      .subscribe(() => this.refresh());
  }
}
