import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ConfigService } from './config.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);

    private authStatus = new BehaviorSubject<boolean>(this.hasToken());

    get isLoggedIn$(): Observable<boolean> {
        return this.authStatus.asObservable();
    }

    private hasToken(): boolean {
        return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
    }
    // private hasToken(): boolean {
    //     if (isPlatformBrowser(this.platformId)) {
    //         return document.cookie.split(';').some(item => item.trim().startsWith('token='));
    //     }
    //     return false;
    // }

    login(credentials: { email: string; password: string }): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.configService.getAuthUrl()}/login`, credentials, { withCredentials: true }).pipe(
        //return this.http.post<void>(`${this.configService.getAuthUrl()}/login`, credentials, { withCredentials: true }).pipe(
            tap (response => {
                // console.log('resp', response);
                localStorage.setItem('token', response.token);
                this.authStatus.next(true);
                // this.router.navigate(['/admin']);
            })
        );
    }

    register(credentials: { email: string; password: string; confirmPassword: string }): Observable<any> {
        return this.http.post(`${this.configService.getAuthUrl()}/register`, credentials, { withCredentials: true });
    }

    saveToken(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.authStatus.next(false);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
        return null;
    }

    constructor(private configService: ConfigService) { }
}
