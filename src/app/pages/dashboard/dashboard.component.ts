import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiNavbarComponent } from '../../components/ui/ui-navbar/ui-navbar.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UiNavbarComponent, HlmButtonDirective, RouterModule],
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {}
