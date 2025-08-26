import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

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
export class AdminLayoutComponent {
    isAdminOrSuperAdmin$ = this.authService.isAdminOrSuperAdmin$;
    
    constructor(private authService: AuthService) { }

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
