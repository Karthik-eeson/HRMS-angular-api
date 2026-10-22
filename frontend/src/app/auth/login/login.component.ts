import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading = false;
  errorMessage = '';
  constructor(private auth: AuthService, private router: Router) {}

loginFormData ={
  emailId:'',
  password:''
}

clickLogin(loginForm: NgForm) {
  if (this.isLoading) return;
  this.errorMessage = '';
  if (loginForm.invalid) {
    loginForm.control.markAllAsTouched();
    this.errorMessage = 'Enter a valid email and password.';
    return;
  }
  this.isLoading = true;
  this.auth.login(this.loginFormData.emailId.trim(), this.loginFormData.password)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: () => { this.loginFormData.password = ''; this.router.navigate(['/admin-dashboard']); },
      error: (error) => {
        this.errorMessage = error.status === 401 ? 'Invalid email or password.'
          : 'Unable to sign in. Please try again later.';
      }
    });
}
}
