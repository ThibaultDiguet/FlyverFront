import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight.services';
import { Router } from '@angular/router';
import { UiNavbarComponent } from '../../components/ui/ui-navbar/ui-navbar.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-reservation-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiNavbarComponent, HlmButtonDirective],
  templateUrl: './reservation-search.component.html'
})
export class ReservationSearchComponent implements OnInit {
  searchForm: FormGroup;
  flights: any[] = [];
  loading = false;
  errorMsg = '';

  upcomingFlights: any[] = [];
  pagedFlights: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    public router: Router
  ) {
    this.searchForm = this.fb.group({
      departure_airport_id: ['', Validators.required],
      arrival_airport_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUpcomingFlights();
  }

  onSearch() {
    this.errorMsg = '';
    this.flights = [];
    if (this.searchForm.invalid) return;
    this.loading = true;
     this.flightService.getFlights('').subscribe({
      next: (flights) => {
        const allFlights = Array.isArray(flights) ? flights : (flights.flights || []);
        const { departure_airport_id, arrival_airport_id } = this.searchForm.value;
        this.flights = allFlights.filter((f: any) =>
          String(f.departure_airport_id) === String(departure_airport_id) &&
          String(f.arrival_airport_id) === String(arrival_airport_id)
        );
        if (this.flights.length === 0) {
          this.errorMsg = 'Aucun vol trouvé pour ces aéroports.';
        }
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Erreur lors de la recherche.';
        this.loading = false;
      }
    });
  }

  reserver(flight: any) {
    this.router.navigate(['/reservation', flight.id_flight]);
  }

  loadUpcomingFlights() {
    this.flightService.getFlights('').subscribe({
      next: (flights) => {
        const allFlights = Array.isArray(flights) ? flights : (flights.flights || []);
        const now = new Date();
        this.upcomingFlights = allFlights
          .filter((f: any) => new Date(f.departure_time) > now)
          .sort((a: any, b: any) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());
        this.totalPages = Math.ceil(this.upcomingFlights.length / this.pageSize) || 1;
        this.setPagedFlights();
      }
    });
  }

  setPagedFlights() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedFlights = this.upcomingFlights.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPagedFlights();
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }
}
