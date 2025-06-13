import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './core/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterModule,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatToolbarModule,
        HttpClientModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('rotateAnimation', [
            state('default', style({ transform: 'rotate(0deg)' })),
            state('rotated', style({ transform: 'rotate(360deg)' })),
            transition('default <=> rotated', animate('300ms ease-in-out'))
        ])
    ]
})
export class AppComponent implements OnInit {
    title: string = 'İbtidai Siniflərin İnkişaf Metodikası';
    darkMode: boolean = false;
    animationState: string = 'default';
    userId: string | null = null;
    isScrolled: boolean = false;

    constructor(
        private matIconRegistry: MatIconRegistry, 
        private domSanitizer: DomSanitizer, 
        private authService: AuthService,
        private router: Router
    ) {
        this.matIconRegistry.addSvgIcon('dark_mode', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/dark_mode.svg'));
        this.matIconRegistry.addSvgIcon('light_mode', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/light_mode.svg'));
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.isScrolled = scrollPosition > 40;
    }

    ngOnInit(): void {
        if (typeof localStorage !== 'undefined') {
            this.userId = this.authService.getUserId();
            this.darkMode = localStorage.getItem('theme') === 'true';
            this.setMode();
        }
    }

    isAuthorized(): boolean {
        return this.authService.getToken() !== null;
    }

    darkModeToogleChanged(): void {
        this.animationState = this.animationState === 'default' ? 'rotated' : 'default';
        this.darkMode = !this.darkMode;
        localStorage.setItem('theme', this.darkMode.toString());
        this.setMode();

    }

    setMode(): void {    
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
            
        } else {
            document.body.classList.remove('dark-mode');
        }

        const tables = document.querySelectorAll('.table');
        tables.forEach(table => {
            if (this.darkMode) {
                table.classList.add('dark-mode');
            } else {
                table.classList.remove('dark-mode');
            }
        });
    }

    goToAdminPanel(): void {
        if (!this.isAuthorized()) {
            this.router.navigate(['/login']);
            return;
        }
        this.router.navigate(['/admin']);
    }

    logInOut(): void {
        if (this.isAuthorized())
            this.authService.logout();
        else 
            this.router.navigate(['/login']);
    }
}
