import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Tournament } from '../../../../core/models/tournament.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AzeFullDatePipe } from '../../../../shared/pipes/aze-full-date.pipe';
import { TournamentTable } from '../../../../core/models/tournamentTable';

@Component({
    selector: 'app-tournament-main',
    standalone: true,
    imports: [
        MatCardModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatButtonModule,
        MatToolbarModule,
        MatTabsModule,
        CommonModule,
        AzeFullDatePipe,
        RouterModule
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
                // Handle the tournament table data
                console.log('Tournament table loaded:', response.data);
                this.tournamentTable = response.data;
            },
            error: (error) => {
                console.error('Error loading tournament table:', error);
            }
        });
    }

}
