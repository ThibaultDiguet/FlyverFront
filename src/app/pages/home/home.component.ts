import { Component } from '@angular/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    HlmButtonDirective
  ],
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
