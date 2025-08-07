import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../../../core/models/game.model';
import { HomeService } from '../../services/home.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-home-last-games',
    standalone: true,
    imports: [
        MatCardModule,
        MatDividerModule,
        MatListModule,
        MatTableModule,
        CommonModule
    ],
    templateUrl: './home-last-games.component.html',
    styleUrls: ['./home-last-games.component.scss']
})
export class HomeLastGamesComponent implements OnInit {
    lastGames: Game[] = [];

    constructor(private homeService: HomeService) {}

    ngOnInit(): void {
        this.getLastGames();
    }

    getLastGames() {
        this.homeService.getLastGames().subscribe({
            next: (response) => {
                this.lastGames = response.data;
            },
            error: (error) => {
                console.error('Error fetching last games:', error);
            }
        });
    }
}
