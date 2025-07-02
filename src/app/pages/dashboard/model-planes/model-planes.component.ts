import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPlaneService } from '../../../services/model-plane.services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import { Router } from '@angular/router';
import {LocalStorageService} from '../../../services/local-storage.service';

@Component({
  selector: 'app-dashboard-model-planes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective, UiNavbarComponent],
  templateUrl: './model-planes.component.html'
})
export class DashboardModelPlanesComponent implements OnInit {
  modelPlanes: any[] = [];
  token: string = '';
  modelPlaneForm: FormGroup;
  editMode = false;
  editingId: number | null = null;

  constructor(
    private modelPlaneService: ModelPlaneService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.modelPlaneForm = this.fb.group({
      name: [''],
      manufacturer: [''],
      capacity: ['']
    });
  }

  ngOnInit() {
    this.token = this.localStorageService.getItem('refresh_token') || '';
    this.refresh();
  }

  refresh() {
    this.modelPlaneService.getModelPlanes(this.token).subscribe({
      next: (res) => {
        this.modelPlanes = Array.isArray(res) ? res : (res.model_planes || []);
      },
      error: () => {
        this.modelPlanes = [];
      }
    });
  }

  onSubmit() {
    if (this.modelPlaneForm.invalid) return;
    const data = this.modelPlaneForm.value;
    if (this.editMode && this.editingId !== null) {
      this.modelPlaneService.updateModelPlane(this.token, this.editingId, data)
        .subscribe(() => {
          this.refresh();
          this.cancelEdit();
        });
    } else {
      this.modelPlaneService.createModelPlane(this.token, data)
        .subscribe(() => {
          this.refresh();
          this.modelPlaneForm.reset();
        });
    }
  }

  edit(model: any) {
    this.router.navigate(['/dashboard/model-planes/edit', model.id_model]);
  }

  cancelEdit() {
    this.editMode = false;
    this.editingId = null;
    this.modelPlaneForm.reset();
  }

  delete(model: any) {
    if (!model) return;
    this.modelPlaneService.deleteModelPlane(this.token, model.id_model)
      .subscribe(() => this.refresh());
  }
}
