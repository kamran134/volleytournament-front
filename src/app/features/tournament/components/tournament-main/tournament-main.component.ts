import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { Tournament } from '../../../../core/models/tournament.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AzeFullDatePipe } from '../../../../shared/pipes/aze-full-date.pipe';
import { TournamentTable } from '../../../../core/models/tournamentTable';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Game } from '../../../../core/models/game.model';

@Component({
    selector: 'app-tournament-main',
    standalone: true,
    imports: [
        MatCardModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSortModule,
        MatPaginatorModule,
        MatButtonModule,
        MatToolbarModule,
        MatTabsModule,
        MatIconModule,
        CommonModule,
        AzeFullDatePipe,
        SafeHtmlPipe,
        RouterModule,
    ],
    templateUrl: './tournament-main.component.html',
    styleUrl: './tournament-main.component.scss'
})
export class TournamentMainComponent implements OnInit {
    tournament: Tournament = {
        _id: '',
        name: 'Champions League',
        startDate: new Date(),
        endDate: new Date(),
        shortName: 'CL',
        country: 'Azerbaijan',
        city: 'Baku',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    shortName: string = '';
    tournamentTable: TournamentTable | null = null;
    allGames: Game[] = [];
    selectedTeamId: string | null = null;

    constructor(private tournamentService: TournamentService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.shortName = params.get('shortName') || '';
            if (this.shortName) {
                this.tournamentService.getTournamentByShortName(this.shortName).subscribe({
                    next: (response) => {
                        this.tournament = response.data;
                        this.loadTournamentTable(); // вызываем второй запрос после первого
                    },
                    error: (error) => {
                        console.error('Error loading tournament:', error);
                    }
                });
            }
        });
    }


    loadTournament(): void {
        this.tournamentService.getTournamentByShortName(this.shortName).subscribe({
            next: (response) => {
                this.tournament = response.data;
            },
            error: (error) => {
                console.error('Error loading tournament:', error);
            }
        });
    }

    loadTournamentTable(): void {
        this.tournamentService.getTournamentTable(this.tournament._id).subscribe({
            next: (response) => {
                this.tournamentTable = response.data;
                this.allGames = structuredClone(this.tournamentTable.games); // сохраняем все игры в переменную
            },
            error: (error) => {
                console.error('Error loading tournament table:', error);
            }
        });
    }

    onTeamSelectChange(teamId: string): void {
        this.selectedTeamId = teamId;
        this.filterGamesByTeam();
    }

    filterGamesByTeam(): void {
        if (this.tournamentTable && this.selectedTeamId) {
            const allGames = this.tournamentTable.games;
            this.allGames = allGames.filter(game =>
                game.team1._id === this.selectedTeamId || game.team2._id === this.selectedTeamId
            );
            // swap if selected team is team 2
            this.allGames.forEach(game => {
                if (game.team2._id === this.selectedTeamId) {
                    [game.team1, game.team2] = [game.team2, game.team1];
                    [game.scoreTeam1, game.scoreTeam2] = [game.scoreTeam2, game.scoreTeam1];
                }
            });
        } else if (this.tournamentTable) {
            // Если команда не выбрана, показываем все игры
            this.allGames = structuredClone(this.tournamentTable.games);
        }
    }

    /**
     * Handle image loading errors by setting a fallback
     */
    onImageError(event: any): void {
        event.target.style.display = 'none';
        // You could also set a default image
        // event.target.src = 'assets/images/default-team-logo.png';
    }

    /**
     * Get team initials for placeholder when logo is not available
     */
    getTeamInitials(teamName: string): string {
        if (!teamName) return '';
        
        return teamName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2); // Limit to 2 characters
    }

    /**
     * Get position class for styling based on rank
     */
    getPositionClass(position: number): string {
        if (position === 1) return 'gold';
        if (position === 2) return 'silver';
        if (position === 3) return 'bronze';
        return 'regular';
    }

    /**
     * Get medal emoji for top 3 positions
     */
    getPositionMedal(position: number): string {
        if (position === 1) return '🥇';
        if (position === 2) return '🥈';
        if (position === 3) return '🥉';
        return '';
    }
}
