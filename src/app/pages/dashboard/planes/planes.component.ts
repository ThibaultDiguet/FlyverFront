import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaneService } from '../../../services/plane.services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-planes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmButtonDirective, UiNavbarComponent],
  templateUrl: './planes.component.html'
})
export class DashboardPlanesComponent implements OnInit {
  planes: any[] = [];
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzUwNzg1NTU0fQ.YRdi-bHjk1T5pMJ_WYWwoJI1hDbLAKfmIQp-Ny-IZMo';
  planeForm: FormGroup;

  constructor(
    private planeService: PlaneService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.planeForm = this.fb.group({
      registration: [''],
      model_id: [''],
    });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.planeService.getPlanes(this.token).subscribe({
      next: (res) => {
        this.planes = Array.isArray(res) ? res : (res.planes || []);
      },
      error: () => {
        this.planes = [];
      }
    });
  }

  onSubmit() {
    if (this.planeForm.invalid) return;
    const planeData = this.planeForm.value;
    this.planeService.createPlane(this.token, planeData)
      .subscribe(() => {
        this.refresh();
        this.planeForm.reset();
      });
  }

  edit(plane: any) {
    this.router.navigate(['/dashboard/planes/edit', plane.id_plane]);
  }

  delete(plane: any) {
    if (!plane) return;
    this.planeService.deletePlane(this.token, plane.id_plane)
      .subscribe(() => this.refresh());
  }
}
