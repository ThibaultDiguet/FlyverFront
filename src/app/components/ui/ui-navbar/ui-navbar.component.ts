import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [RouterModule, HlmButtonDirective, CommonModule],
  template: `
    <nav class="flex items-center justify-between px-8 py-4 bg-muted border-b border-border shadow">
      <div class="font-bold text-xl tracking-wide">Flyver</div>
      <div class="flex gap-2">
        <a routerLink="/" hlmBtn variant="ghost">Accueil</a>
        <a routerLink="/reservation" hlmBtn variant="ghost">Réservation</a>
        <a *ngIf="isAdmin" routerLink="/dashboard" hlmBtn variant="outline">Dashboard</a>
        <button
          *ngIf="isAuthenticated"
          hlmBtn
          variant="destructive"
          (click)="logout()"
          type="button"
        >Déconnexion</button>
        <a
          *ngIf="!isAuthenticated"
          routerLink="/login"
          hlmBtn
          variant="default"
          >Connexion</a>
      </div>
    </nav>
  `
})

export class UiNavbarComponent {
  get isAdmin() {
    return this.authService.isAdmin();
  }
  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
