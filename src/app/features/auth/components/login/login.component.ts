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
                this.authService.saveToken(response.token);
            },
            error: (error) => {
                this.errorMessage.set(error.error.message || 'Girişdə xəta');
            }
        });
    }
}
