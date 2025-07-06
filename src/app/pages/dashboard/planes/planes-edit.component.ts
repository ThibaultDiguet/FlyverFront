import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlaneService } from '../../../services/plane.services';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import {LocalStorageService} from '../../../services/local-storage.service';

@Component({
  selector: 'app-plane-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective, UiNavbarComponent],
  template: `
    <ui-navbar></ui-navbar>
    <div class="p-6 max-w-xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Modifier l'avion</h2>
      <form [formGroup]="planeForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label>Immatriculation</label>
          <input class="border p-2 w-full" formControlName="registration" />
        </div>
        <div class="mb-4">
          <label>Modèle</label>
          <input class="border p-2 w-full" formControlName="model" />
        </div>
        <button hlmBtn type="submit" variant="outline" [disabled]="planeForm.invalid">Enregistrer</button>
        <button hlmBtn type="button" variant="destructive" (click)="cancel()" class="ml-2">Annuler</button>
      </form>
    </div>
  `
})
export class PlaneEditComponent implements OnInit {
  planeForm: FormGroup;
  id: number;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private planeService: PlaneService,
    private router: Router
  ) {
    this.planeForm = this.fb.group({
      registration: ['', Validators.required],
      model: ['', Validators.required],
    });
    this.id = 0;
  }

  ngOnInit() {
    this.token = this.localStorageService.getItem('refresh_token') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.planeService.getPlane(this.token, this.id).subscribe((plane: any) => {
      this.planeForm.patchValue({
        registration: plane.registration,
        model: plane.model_id,
      });
    });
  }

  onSubmit() {
    if (this.planeForm.invalid) return;
    const planeData = this.planeForm.value;
    this.planeService.updatePlane(this.token, this.id, planeData).subscribe(() => {
      this.router.navigate(['/dashboard/planes']);
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/planes']);
  }
}
