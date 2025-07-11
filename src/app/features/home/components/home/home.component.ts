import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../../core/services/auth.service';
import { HomeTournamentsComponent } from "../home-tournaments/home-tournaments.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        CommonModule,
        RouterModule,
        HomeTournamentsComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    authorizedUserRole: string | null = null;
    isAdminOrSuperAdmin$ = this.authService.isAdminOrSuperAdmin$;
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            if (isLoggedIn) {
                this.authorizedUserRole = this.authService.getRole();
                this.isLoggedIn = true;
            }
        });
    }

    logInOut(): void {
        if (this.isLoggedIn)
            this.authService.logout();
        else 
            this.router.navigate(['/login']);
    }
}
