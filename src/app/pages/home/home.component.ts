import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiNavbarComponent } from '../../components/ui/ui-navbar/ui-navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    UiNavbarComponent,
    RouterModule
  ],
  styleUrl: './home.component.css'
})
export class HomeComponent {}
