import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {LocalStorageService} from './services/local-storage.service';
import {UserService} from './services/user.service';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FlyverFront';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ){};

  ngOnInit(): void {

    let wantedRoute = window.location.pathname;

    const refreshToken = this.localStorageService.getItem('refresh_token');
    if (refreshToken) {
      this.authService.refreshToken().subscribe({
        next: () => {

          if (wantedRoute === '/' || wantedRoute === '/login') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate([wantedRoute]);
          }
        },
        error: () => {
          this.localStorageService.removeItem('refresh_token');
          this.userService.clearUser();
        }
      });
    }
  }

}
