import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../core/models/tournament.model';
import { HomeService } from '../../services/home.service';

@Component({
    selector: 'app-home-tournaments',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './home-tournaments.component.html',
    styleUrls: ['./home-tournaments.component.scss']
})
export class HomeTournamentsComponent implements OnInit {
    tournaments: Tournament[] = [];

    constructor(private homeService: HomeService) {}

    ngOnInit(): void {
        this.loadTournaments();
    }

    loadTournaments(): void {
        this.homeService.getTournaments().subscribe({
            next: (response) => {
                this.tournaments = response.data;
            },
            error: (error) => {
                console.error('Error loading tournaments:', error);
            }
        });
    }

    onTournamentClick(tournament: Tournament): void {
        console.log('Tournament clicked:', tournament);
        // Add your logic here to handle the tournament click
    }

    joinTournament(tournament: Tournament): void {
        console.log('Join tournament clicked:', tournament);
        // Add your logic here to handle joining the tournament
    }

}
