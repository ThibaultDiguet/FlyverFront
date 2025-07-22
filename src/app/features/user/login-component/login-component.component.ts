import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {UiNavbarComponent} from '../../../components/ui/ui-navbar/ui-navbar.component';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    UiNavbarComponent
  ],
  templateUrl: 'login-component.component.html',
  styleUrl: 'login-component.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  invalidCredentials: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitForm() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      this.isLoading = true;
      this.authService.login(formData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.invalidCredentials = true;
          this.isLoading = false;
        }
      });
    }
  }

  isFieldInvalid(field: string) {
    return this.loginForm.get(field)?.invalid && this.loginForm.get(field)?.touched
  }
}
