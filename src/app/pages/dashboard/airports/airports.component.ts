import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportService } from '../../../services/airport.services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import { Router } from '@angular/router';
import { FormArray } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  constructor(
    private airportService: AirportService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.airportForm = this.fb.group({
      name: [''],
      iata: [''],
      city: [''],
      country: [''],
      image_urls: this.fb.array([])
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

  get imageUrls(): FormArray {
    return this.airportForm.get('image_urls') as FormArray;
  }

  addImageUrl() {
    this.imageUrls.push(this.fb.control(''));
  }

  removeImageUrl(index: number) {
    this.imageUrls.removeAt(index);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.imageUrls.push(this.fb.control(base64));
      };
      reader.readAsDataURL(file);
    });
  }

  onSubmit() {
    if (this.airportForm.invalid) return;
    const airportData = {
      ...this.airportForm.value,
      iata: this.airportForm.value.iata?.toUpperCase() || '',
      image_urls: this.airportForm.value.image_urls.filter((url: string) => url)
    };
    console.log(airportData);
    this.airportService.createAirport(this.token, airportData)
      .subscribe(() => {
        this.refresh();
        this.airportForm.reset();
        this.imageUrls.clear();
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
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
