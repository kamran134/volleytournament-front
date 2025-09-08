import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, filter, take, BehaviorSubject } from 'rxjs';

// Global refresh state to prevent multiple simultaneous refresh attempts
const isRefreshingSubject = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    
    // Skip token refresh for auth endpoints to prevent infinite loops
    const isAuthRequest = req.url.includes('/auth/login') || 
                         req.url.includes('/auth/register') || 
                         req.url.includes('/auth/refresh-token') ||
                         req.url.includes('/auth/logout');

    const token = authService.getToken();

    if (token && !isAuthRequest) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
    } else if (!isAuthRequest) {
        // Always send credentials for non-auth requests to include HTTP-only cookies
        req = req.clone({
            withCredentials: true
        });
    }
    
    // Add automatic token refresh logic
    return next(req).pipe(
        catchError(error => {
            // If we get 401 Unauthorized and it's not an auth request
            if (error.status === 401 && !isAuthRequest) {
                // Check if we're already refreshing
                if (isRefreshingSubject.value) {
                    // Wait for the refresh to complete
                    return isRefreshingSubject.pipe(
                        filter(isRefreshing => !isRefreshing),
                        take(1),
                        switchMap(() => {
                            // Retry the original request with new token
                            const newToken = authService.getToken();
                            if (newToken) {
                                const retryReq = req.clone({
                                    setHeaders: { Authorization: `Bearer ${newToken}` },
                                    withCredentials: true
                                });
                                return next(retryReq);
                            }
                            return throwError(() => error);
                        })
                    );
                }
                
                // Set refreshing state
                isRefreshingSubject.next(true);
                
                // Try to refresh the token
                return authService.refreshAccessToken().pipe(
                    switchMap(() => {
                        isRefreshingSubject.next(false);
                        // Retry the original request with new token
                        const newToken = authService.getToken();
                        if (newToken) {
                            const retryReq = req.clone({
                                setHeaders: { Authorization: `Bearer ${newToken}` },
                                withCredentials: true
                            });
                            return next(retryReq);
                        }
                        return throwError(() => error);
                    }),
                    catchError(refreshError => {
                        isRefreshingSubject.next(false);
                        // Refresh failed, redirect to login
                        console.error('Token refresh failed in interceptor:', refreshError);
                        authService.logout();
                        return throwError(() => error);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
