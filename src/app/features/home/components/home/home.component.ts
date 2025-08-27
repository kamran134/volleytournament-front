
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HomeTournamentsComponent } from "../home-tournaments/home-tournaments.component";
import { HomeGamesComponent } from "../home-games/home-games.component";
import { HomeLastGamesComponent } from "../home-last-games/home-last-games.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
    RouterModule,
    MatButtonModule,
    HomeTournamentsComponent,
    HomeGamesComponent,
    HomeLastGamesComponent
],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    private isIOS = false;
    private scrollListener?: () => void;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.detectIOSAndApplyFix();
        }
    }

    ngOnDestroy(): void {
        if (this.scrollListener && isPlatformBrowser(this.platformId)) {
            window.removeEventListener('scroll', this.scrollListener);
        }
    }

    private detectIOSAndApplyFix(): void {
        // Detect iOS
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (this.isIOS) {
            // Add iOS-specific class to body for CSS targeting
            document.body.classList.add('ios-device');
            
            // Alternative: JavaScript-based fixed background for iOS
            this.applyIOSBackgroundFix();
        }
    }

    private applyIOSBackgroundFix(): void {
        const homeContainer = document.querySelector('.home-container');
        if (homeContainer) {
            // Set viewport height property for iOS
            const setVH = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            
            setVH();
            window.addEventListener('resize', setVH);
            window.addEventListener('orientationchange', setVH);
        }
    }

    scrollToTournaments(): void {
        const tournamentsSection = document.querySelector('.home-tournaments');
        if (tournamentsSection) {
            tournamentsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
