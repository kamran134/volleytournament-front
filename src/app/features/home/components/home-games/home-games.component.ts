import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AzeFullDatePipe } from '../../../../shared/pipes/aze-full-date.pipe';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { HomeService } from '../../services/home.service';
import { Game } from '../../../../core/models/game.model';

@Component({
    selector: 'app-home-games',
    standalone: true,
    imports: [
        MatCardModule,
        MatIconModule,
        AzeFullDatePipe,
        CommonModule
    ],
    templateUrl: './home-games.component.html',
    styleUrls: ['./home-games.component.scss']
})
export class HomeGamesComponent implements OnInit {
    games: Game[] = [];

    constructor(private homeService: HomeService) {}

    ngOnInit(): void {
        this.loadGames();
    }

    loadGames(): void {
        this.homeService.getUpcomingGames().subscribe(response => {
            this.games = response.data;
        });
    }

    onGameClick(game: Game): void {
        //this.homeService.setGame(game);
    }

}
