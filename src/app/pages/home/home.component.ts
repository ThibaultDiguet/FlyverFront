import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BtableService } from '../../services/btable.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    HlmButtonDirective,
    CommonModule,
  ],
  styleUrl: './home.component.css'
})

export class HomeComponent {
  btable$: any;

  constructor(private btableService: BtableService) {
    this.btable$ = this.btableService.getBtable('');
  }
}
