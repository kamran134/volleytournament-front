import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn$.pipe(
        map(isLoggedIn => {
            if (!isLoggedIn) {
                router.navigate(['/login']);
                return false;
            }
            
            // Check if token is still valid
            if (!authService.checkTokenValidity()) {
                // Token is expired, the interceptor will handle refresh automatically
                // For now, let the request proceed and let interceptor handle it
                console.log('Token expired, will be refreshed by interceptor if needed');
            }
            
            return true;
        }),
        catchError(() => {
            router.navigate(['/login']);
            return of(false);
        })
    );
};