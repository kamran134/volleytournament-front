
import { Component } from '@angular/core';
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
export class HomeComponent{
    scrollToTournaments(): void {
        const tournamentsSection = document.querySelector('.home-tournaments');
        if (tournamentsSection) {
            tournamentsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
