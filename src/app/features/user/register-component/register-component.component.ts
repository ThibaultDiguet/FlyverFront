import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UiNavbarComponent } from '../../../components/ui/ui-navbar/ui-navbar.component';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, UiNavbarComponent],
  templateUrl: './register-component.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      first_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitForm() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    const formData = {
    name: this.registerForm.value.name,
    first_name: this.registerForm.value.first_name,
    email: this.registerForm.value.email,
    password_hash: this.registerForm.value.password,
    is_admin: false
  };
  this.authService.register(formData).subscribe({
      next: () => {
        console.log("tetettt");
        this.successMsg = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.log("gydue");
        this.errorMsg = err?.error?.detail || 'Erreur lors de l\'inscription.';
        this.isLoading = false;
      }
    });
  }

  isFieldInvalid(field: string) {
    return this.registerForm.get(field)?.invalid && this.registerForm.get(field)?.touched;
  }
}
