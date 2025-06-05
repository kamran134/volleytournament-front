import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ConfigService } from './config.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);

    // private userRole: string | null = isPlatformBrowser(this.platformId) && !!localStorage.getItem('role') ? localStorage.getItem('role') : '';
    // private userId: string | null = isPlatformBrowser(this.platformId) && !!localStorage.getItem('id') ? localStorage.getItem('id') : '';
    private authStatus = new BehaviorSubject<boolean>(this.hasToken());
    private userId = new BehaviorSubject<string | null>(
        isPlatformBrowser(this.platformId) ? localStorage.getItem('id') : null
    );
    private userRole = new BehaviorSubject<string | null>(
        isPlatformBrowser(this.platformId) ? localStorage.getItem('role') : null
    );

    get isLoggedIn$(): Observable<boolean> {
        return this.authStatus.asObservable();
    }

    get userRole$(): Observable<string | null> {
        return this.userRole.asObservable();
    }

    get isAdminOrSuperAdmin$(): Observable<boolean> {
        return this.userRole$.pipe(
            map(role => role === 'admin' || role === 'superadmin')
        );
    }

    getRole(): string | null {
        if (!this.userRole.value) {
            this.userRole.next(this.getRoleFromToken());
        }
        return this.userRole.value;
    }

    getUserId(): string | null {
        if (!this.userId.value) {
            this.userId.next(this.getUserIdFromToken());
        }
        return this.userId.value;
    }

    updateUserRole(role: string | null) {
        this.userRole.next(role);
        if (isPlatformBrowser(this.platformId)) {
            if (role) {
                localStorage.setItem('role', role);
            } else {
                localStorage.removeItem('role');
            }
        }
    }

    isAdmin(): boolean {
        return this.userRole.value === 'admin';
    }

    isSuperAdmin(): boolean {
        return this.userRole.value === 'superadmin';
    }

    isAdminOrSuperAdmin(): boolean {
        return this.isAdmin() || this.isSuperAdmin();
    }

    get isAuthorized(): boolean {
        return this.authStatus.getValue();
    }

    private hasToken(): boolean {
        return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
    }

    private getUserIdFromToken(): string | null {
        const token = this.getToken();
        if (!token || !isPlatformBrowser(this.platformId)) {
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || null;
        }
        catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    private getRoleFromToken(): string | null {
        const token = this.getToken();
        if (!token || !isPlatformBrowser(this.platformId)) {
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || null;
        }
        catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    login(credentials: { email: string; password: string }): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(
            `${this.configService.getAuthUrl()}/login`,
            credentials,
            { withCredentials: true }).pipe(
                tap(response => {
                    localStorage.setItem('token', response.token);
                    this.authStatus.next(true);
                    this.router.navigate(['/admin']);
                })
            );
    }

    register(credentials: { email: string; password: string; confirmPassword: string }): Observable<any> {
        return this.http.post(`${this.configService.getAuthUrl()}/register`, credentials, { withCredentials: true });
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
        return null;
    }

    saveToken(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
        }
    }

    logout(): void {
        this.http.post(`${this.configService.getAuthUrl()}/logout`, {}, { withCredentials: true })
            .pipe(
                tap(() => {
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.removeItem('token');
                    }
                    this.userRole.next(null);
                    this.authStatus.next(false);
                    this.router.navigate(['/login']);
                })
            )
            .subscribe();
    }

    constructor(private configService: ConfigService) {
        if (isPlatformBrowser(this.platformId)) {
            const token = this.getToken();
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.userRole.next(payload.role || null);
                this.userId.next(payload.userId || null);
            }
        }
    }
}
