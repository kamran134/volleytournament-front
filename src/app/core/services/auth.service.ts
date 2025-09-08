import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap, catchError, switchMap, throwError, filter, take } from 'rxjs';
import { ConfigService } from './config.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse, RefreshTokenResponse } from '../models/response.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);

    // Refresh token management
    private isRefreshing = new BehaviorSubject<boolean>(false);
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);
    private tokenRefreshTimer: any = null;

    private authStatus = new BehaviorSubject<boolean>(this.hasToken());
    private userId = new BehaviorSubject<string | null>(
        isPlatformBrowser(this.platformId) ? localStorage.getItem('userId') : null
    );
    private userRole = new BehaviorSubject<string | null>(
        isPlatformBrowser(this.platformId) ? localStorage.getItem('role') : null
    );

    constructor(private configService: ConfigService) {
        if (isPlatformBrowser(this.platformId)) {
            const token = this.getToken();
            
            if (token && !this.isTokenExpired()) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    this.userRole.next(payload.role || null);
                    this.userId.next(payload.userId || payload.sub || null);
                    this.authStatus.next(true);
                    this.scheduleTokenRefresh();
                } catch (error) {
                    console.error('Error parsing token in constructor:', error);
                    this.clearTokens();
                }
            } else {
                // Token expired or missing, try to refresh using cookie-based refresh token
                this.refreshAccessToken().subscribe({
                    next: () => console.log('Token refreshed on service init'),
                    error: () => this.clearTokens()
                });
            }
        }
    }

    get isLoggedIn$(): Observable<boolean> {
        return this.authStatus.asObservable();
    }

    get userRole$(): Observable<string | null> {
        return this.userRole.asObservable();
    }

    get isSuperAdmin$(): Observable<boolean> {
        return this.userRole$.pipe(
            map(role => role === 'superadmin')
        );
    }

    get isAdminOrSuperAdmin$(): Observable<boolean> {
        return this.userRole$.pipe(
            map(role => role === 'admin' || role === 'superadmin')
        );
    }

    get isLevelUpUser$(): Observable<boolean> {
        return this.userRole$.pipe(
            map(role => role === 'superadmin' && !this.isSuperAdmin$)
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

    checkTokenValidity(): boolean {
        return !this.isTokenExpired();
    }

    get isAuthorized(): boolean {
        return this.authStatus.getValue();
    }

    private hasToken(): boolean {
        // Check if we have an access token, regardless of expiration
        // If expired, the refresh mechanism will handle it
        return isPlatformBrowser(this.platformId) && 
               !!localStorage.getItem('accessToken');
    }

    getRefreshToken(): string | null {
        // Since we're using HTTP-only cookies, we can't access the refresh token directly
        // The backend will handle refresh token validation via cookies
        return 'cookie-based'; // Placeholder to indicate we have a cookie-based refresh token
    }

    saveTokens(accessToken: string, refreshToken?: string): void {
        if (isPlatformBrowser(this.platformId)) {
            // Only save access token to localStorage for Authorization header
            // Refresh token is managed by HTTP-only cookies on the backend
            localStorage.setItem('accessToken', accessToken);
            
            // Extract user info from token
            try {
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                localStorage.setItem('userId', payload.userId || payload.sub || '');
                localStorage.setItem('role', payload.role || '');
                this.userId.next(payload.userId || payload.sub || null);
                this.userRole.next(payload.role || null);
            } catch (error) {
                console.error('Error parsing token:', error);
            }
            
            this.scheduleTokenRefresh();
        }
    }

    clearTokens(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');
            this.clearTokenRefreshTimer();
        }
        this.authStatus.next(false);
        this.userId.next(null);
        this.userRole.next(null);
    }

    private getUserIdFromToken(): string | null {
        const token = this.getToken();
        if (!token || !isPlatformBrowser(this.platformId)) {
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || payload.sub || null;
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

    private isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token || !isPlatformBrowser(this.platformId)) {
            return true;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp;
            if (!exp) {
                return true; // No expiration time in token
            }
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            return exp < currentTime; // Check if token is expired
        } catch (error) {
            console.error('Error decoding token:', error);
            return true; // Assume expired if there's an error
        }
    }

    private isTokenExpiringSoon(): boolean {
        const token = this.getToken();
        if (!token || !isPlatformBrowser(this.platformId)) {
            return true;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp;
            if (!exp) {
                return true;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            const bufferTime = 5 * 60; // 5 minutes in seconds
            return (exp - currentTime) <= bufferTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    }

    private scheduleTokenRefresh(): void {
        const token = this.getToken();
        if (!token) return;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp;
            if (!exp) return;
            
            const currentTime = Math.floor(Date.now() / 1000);
            const timeUntilRefresh = (exp - currentTime - 5 * 60) * 1000; // Refresh 5 minutes before expiry
            
            if (timeUntilRefresh > 0) {
                this.clearTokenRefreshTimer();
                this.tokenRefreshTimer = setTimeout(() => {
                    this.refreshAccessToken().subscribe({
                        next: () => console.log('Token refreshed automatically'),
                        error: (error) => {
                            console.error('Auto refresh failed:', error);
                            this.logout();
                        }
                    });
                }, timeUntilRefresh);
            }
        } catch (error) {
            console.error('Error scheduling token refresh:', error);
        }
    }

    private clearTokenRefreshTimer(): void {
        if (this.tokenRefreshTimer) {
            clearTimeout(this.tokenRefreshTimer);
            this.tokenRefreshTimer = null;
        }
    }

    login(credentials: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.configService.getAuthUrl()}/login-refresh`,
            credentials,
            { withCredentials: true }
        ).pipe(
            tap(response => {
                this.saveTokens(response.accessToken);
                this.authStatus.next(true);
                this.router.navigate(['/admin']);
            }),
            catchError(error => {
                console.error('Login failed:', error);
                return throwError(() => error);
            })
        );
    }

    refreshAccessToken(): Observable<RefreshTokenResponse> {
        // Since we're using HTTP-only cookies, we don't need to send refresh token in the body
        // The server will read it from the cookie
        
        if (this.isRefreshing.value) {
            // If already refreshing, wait for the current refresh to complete
            return this.refreshTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(() => throwError(() => new Error('Retry after refresh')))
            );
        }
        
        this.isRefreshing.next(true);
        this.refreshTokenSubject.next(null);
        
        return this.http.post<RefreshTokenResponse>(
            `${this.configService.getAuthUrl()}/refresh-token`,
            {}, // Empty body since token is in HTTP-only cookie
            { withCredentials: true }
        ).pipe(
            tap(response => {
                if (response.accessToken) {
                    // Save new access token
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem('accessToken', response.accessToken);
                        
                        // Extract user info from new token
                        try {
                            const payload = JSON.parse(atob(response.accessToken.split('.')[1]));
                            localStorage.setItem('userId', payload.userId || payload.sub || '');
                            localStorage.setItem('role', payload.role || '');
                            this.userId.next(payload.userId || payload.sub || null);
                            this.userRole.next(payload.role || null);
                        } catch (error) {
                            console.error('Error parsing token:', error);
                        }
                    }
                }
                this.refreshTokenSubject.next(response.accessToken);
                this.isRefreshing.next(false);
                this.scheduleTokenRefresh();
            }),
            catchError(error => {
                console.error('Token refresh failed:', error);
                this.isRefreshing.next(false);
                this.logout();
                return throwError(() => error);
            })
        );
    }

    register(credentials: { email: string; password: string; confirmPassword: string }): Observable<any> {
        return this.http.post(`${this.configService.getAuthUrl()}/register`, credentials, { withCredentials: true });
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('accessToken');
        }
        return null;
    }

    saveToken(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', token);
        }
    }

    logout(): void {
        this.clearTokenRefreshTimer();
        
        // Send logout request to backend to clear HTTP-only cookies
        this.http.post(`${this.configService.getAuthUrl()}/logout-refresh`, {}, { withCredentials: true })
            .subscribe({
                next: () => console.log('Logout successful'),
                error: (error) => console.error('Logout error:', error)
            });
        
        this.clearTokens();
        this.router.navigate(['/login']);
    }

    logoutAllDevices(): Observable<any> {
        return this.http.post(`${this.configService.getAuthUrl()}/logout-all`, {}, { withCredentials: true })
            .pipe(
                tap(() => {
                    this.clearTokens();
                    this.router.navigate(['/login']);
                }),
                catchError(error => {
                    console.error('Logout all devices failed:', error);
                    // Even if the request fails, clear local tokens
                    this.clearTokens();
                    this.router.navigate(['/login']);
                    return throwError(() => error);
                })
            );
    }
}
