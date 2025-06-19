import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiNavbarComponent } from '../../components/ui/ui-navbar/ui-navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  imports: [
    CommonModule,
    UiNavbarComponent,
    RouterModule
  ],
})

export class ReservationComponent {

  constructor() { }
}
