import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../core/models/tournament.model';
import { HomeService } from '../../services/home.service';
import { ConfigService } from '../../../../core/services/config.service';
import { AzeFullDatePipe } from '../../../../shared/pipes/aze-full-date.pipe';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-tournaments',
    standalone: true,
    imports: [
        AzeFullDatePipe,
        CommonModule
    ],
    templateUrl: './home-tournaments.component.html',
    styleUrls: ['./home-tournaments.component.scss']
})
export class HomeTournamentsComponent implements OnInit {
    tournaments: Tournament[] = [];
    baseUrl: string = '';

    constructor(private homeService: HomeService, private configService: ConfigService, private router: Router) {
        this.baseUrl = this.configService.getStaticUrl();
    }

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
        // Navigate to the tournament details page
        this.router.navigate(['/tournament', tournament.shortName]);
    }

    joinTournament(tournament: Tournament): void {
        console.log('Join tournament clicked:', tournament);
        // Add your logic here to handle joining the tournament
    }

}
