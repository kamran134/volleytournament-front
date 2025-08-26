import { HttpClientModule } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    errorMessage = signal<string | null>(null);

    loginForm = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    submit() {
        if (this.loginForm.invalid) return;

        this.authService.login(this.loginForm.getRawValue()).subscribe({
            next: (response) => {
                // Token handling is done automatically in the auth service
                this.router.navigate(['/admin']);
            },
            error: (error) => {
                if (error.status === 401) {
                    this.errorMessage.set('Invalid credentials. Please check your email and password.');
                } else if (error.status === 429) {
                    this.errorMessage.set('Too many login attempts. Please try again later.');
                } else {
                    this.errorMessage.set(error.error?.message || 'Login failed. Please try again.');
                }
            }
        });
    }
}
