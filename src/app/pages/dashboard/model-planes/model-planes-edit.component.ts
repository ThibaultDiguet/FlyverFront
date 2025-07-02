import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModelPlaneService } from '../../../services/model-plane.services';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import {LocalStorageService} from '../../../services/local-storage.service';

@Component({
  selector: 'app-model-plane-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective, UiNavbarComponent],
  template: `
    <ui-navbar></ui-navbar>
    <div class="p-6 max-w-xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Modifier le modèle d'avion</h2>
      <form [formGroup]="modelPlaneForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label>Nom</label>
          <input class="border p-2 w-full" formControlName="name" />
        </div>
        <div class="mb-4">
          <label>Constructeur</label>
          <input class="border p-2 w-full" formControlName="manufacturer" />
        </div>
        <div class="mb-4">
          <label>Capacité</label>
          <input class="border p-2 w-full" type="number" formControlName="capacity" />
        </div>
        <button hlmBtn type="submit" variant="outline" [disabled]="modelPlaneForm.invalid">Enregistrer</button>
        <button hlmBtn type="button" variant="destructive" (click)="cancel()" class="ml-2">Annuler</button>
      </form>
    </div>
  `
})
export class ModelPlaneEditComponent implements OnInit {
  modelPlaneForm: FormGroup;
  id: number;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private modelPlaneService: ModelPlaneService,
    private router: Router
  ) {
    this.modelPlaneForm = this.fb.group({
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      capacity: ['', Validators.required]
    });
    this.id = 0;
  }

  ngOnInit() {
    this.token = this.localStorageService.getItem('refresh_token') || '';
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.modelPlaneService.getModelPlane(this.token, this.id).subscribe((model: any) => {
      this.modelPlaneForm.patchValue({
        name: model.name,
        manufacturer: model.manufacturer,
        capacity: model.capacity
      });
    });
  }

  onSubmit() {
    if (this.modelPlaneForm.invalid) return;
    const modelPlaneData = this.modelPlaneForm.value;
    this.modelPlaneService.updateModelPlane(this.token, this.id, modelPlaneData).subscribe(() => {
      this.router.navigate(['/dashboard/model-planes']);
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/model-planes']);
  }
}
