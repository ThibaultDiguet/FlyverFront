import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AirportService } from '../../../services/airport.services';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import {LocalStorageService} from '../../../services/local-storage.service';

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


        <div class="mb-4">
          <label class="mb-1 font-medium text-sm text-muted-foreground flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M12 4v8" />
            </svg>
            Images (upload)
          </label>
          <button hlmBtn type="button" variant="outline" size="sm"
                  (click)="triggerFileInput()" class="w-fit mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une ou plusieurs images
          </button>
          <input #fileInput type="file" (change)="onImageSelected($event)" multiple accept="image/*"
                class="hidden" />

          <div class="flex flex-wrap gap-3 mt-2">
            <div *ngFor="let ctrl of imageUrls.controls; let i = index" class="flex flex-col items-center gap-1">
              <img *ngIf="ctrl.value" [src]="ctrl.value" alt="img"
                  class="h-16 w-16 object-cover rounded border shadow" />
              <button hlmBtn type="button" variant="destructive" size="icon" (click)="removeImageUrl(i)" class="mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <span *ngIf="imageUrls.length === 0" class="text-xs text-muted-foreground mt-2">Aucune image sélectionnée</span>
          </div>
          <span class="text-xs text-muted-foreground mt-1">Formats acceptés : JPG, PNG, GIF. Plusieurs images possibles.</span>
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
  token: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private airportService: AirportService,
    private router: Router
  ) {
    this.airportForm = this.fb.group({
      name: ['', Validators.required],
      iata: ['', [Validators.required, Validators.maxLength(3)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      image_urls: this.fb.array([])
    });
    this.id = 0;
  }

  ngOnInit() {
    this.token = this.localStorageService.getItem('refresh_token') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.airportService.getAirport(this.token, this.id).subscribe((airport: any) => {
      this.airportForm.patchValue({
        name: airport.name,
        iata: airport.iata,
        city: airport.city,
        country: airport.country
      });

      this.imageUrls.clear();
      if (airport.image_urls && Array.isArray(airport.image_urls)) {
        airport.image_urls.forEach((img: string) => this.imageUrls.push(this.fb.control(img)));
      }
    });
  }

  get imageUrls(): FormArray {
    return this.airportForm.get('image_urls') as FormArray;
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
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

   removeImageUrl(index: number) {
    this.imageUrls.removeAt(index);
  }

  onSubmit() {
    if (this.airportForm.invalid) return;
    const airportData = {
      ...this.airportForm.value,
      iata: this.airportForm.value.iata?.toUpperCase() || '',
      image_urls: this.airportForm.value.image_urls.filter((url: string) => url)
    };
    this.airportService.updateAirport(this.token, this.id, airportData).subscribe(() => {
      this.router.navigate(['/dashboard/airports']);
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/airports']);
  }
}
