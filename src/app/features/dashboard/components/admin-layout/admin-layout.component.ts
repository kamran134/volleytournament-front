import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        RouterModule
    ],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav') sidenav!: MatSidenav;
    
    isAdminOrSuperAdmin$ = this.authService.isAdminOrSuperAdmin$;
    isSidenavMinimized = false;
    isMobile = false;
    
    private breakpointSubscription!: Subscription;
    
    constructor(
        private authService: AuthService,
        private breakpointObserver: BreakpointObserver
    ) { }

    ngOnInit(): void {
        // Check for mobile devices
        this.breakpointSubscription = this.breakpointObserver
            .observe([Breakpoints.Handset])
            .subscribe(result => {
                this.isMobile = result.matches;
                if (this.isMobile && this.sidenav) {
                    this.sidenav.close();
                }
            });
    }

    ngOnDestroy(): void {
        if (this.breakpointSubscription) {
            this.breakpointSubscription.unsubscribe();
        }
    }

    toggleSidenav(): void {
        if (this.isMobile) {
            this.sidenav.toggle();
        } else {
            this.isSidenavMinimized = !this.isSidenavMinimized;
        }
    }

    logout() {
        this.authService.logout();
    }

    logoutAllDevices() {
        this.authService.logoutAllDevices().subscribe({
            next: () => console.log('Logged out from all devices'),
            error: (error) => console.error('Logout all devices failed:', error)
        });
    }
}
