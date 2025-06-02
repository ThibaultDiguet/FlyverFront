import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPlaneService } from '../../../services/model-plane.services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-dashboard-model-planes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective],
  templateUrl: './model-planes.component.html'
})
export class DashboardModelPlanesComponent implements OnInit {
  modelPlanes: any[] = [];
  token = 'TOKEN_ICI'; // Remplace par le vrai token
  modelPlaneForm: FormGroup;
  editMode = false;
  editingId: number | null = null;

  constructor(
    private modelPlaneService: ModelPlaneService,
    private fb: FormBuilder
  ) {
    this.modelPlaneForm = this.fb.group({
      name: [''],
      manufacturer: [''],
      capacity: ['']
    });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.modelPlaneService.getModelPlanes(this.token).subscribe({
      next: (res) => {
        this.modelPlanes = res;
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
    this.editMode = true;
    this.editingId = model.id_model_plane;
    this.modelPlaneForm.patchValue({
      name: model.name,
      manufacturer: model.manufacturer,
      capacity: model.capacity
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.editingId = null;
    this.modelPlaneForm.reset();
  }

  delete(model: any) {
    if (!model) return;
    this.modelPlaneService.deleteModelPlane(this.token, model.id_model_plane)
      .subscribe(() => this.refresh());
  }
}
