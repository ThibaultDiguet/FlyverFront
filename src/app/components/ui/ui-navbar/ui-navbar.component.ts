import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [RouterModule, HlmButtonDirective, CommonModule],
  template: `
    <nav class="flex items-center justify-between px-8 py-4 bg-muted border-b border-border shadow">
      <div class="font-bold text-xl tracking-wide">FlyverFront</div>
      <div class="flex gap-2">
        <a routerLink="/" hlmBtn variant="ghost">Accueil</a>
        <a routerLink="/dashboard" hlmBtn variant="outline">Dashboard</a>
      </div>
    </nav>
  `
})
export class UiNavbarComponent {}
