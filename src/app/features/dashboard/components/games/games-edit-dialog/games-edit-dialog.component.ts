import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CreateGameDto, UpdateGameDto } from '../../../../../core/models/game.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Team } from '../../../../../core/models/team.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tournament } from '../../../../../core/models/tournament.model';
import { Moment } from 'moment';

@Component({
    selector: 'app-games-edit-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        FormsModule,
        CommonModule
    ],
    templateUrl: './games-edit-dialog.component.html',
    styleUrl: './games-edit-dialog.component.scss'
})
export class GamesEditDialogComponent implements OnInit {
    selectedTeam1Id: string = '';
    selectedTeam2Id: string = '';
    selectedWinnerId?: string = undefined;
    selectedTournamentId: string = '';
    teams1: Team[] = [];
    teams2: Team[] = [];
    winnerTeams: Team[] = [];
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    };
    tournaments: Tournament[] = [];
    gameStartTime: string = '';
    gameEndTime: string = '';

    constructor(
        public dialogRef: MatDialogRef<GamesEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: CreateGameDto | UpdateGameDto,
        private dashboardService: DashboardService,
        private matSnackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.dashboardService.getTeams({ page: 1, size: 100 }).subscribe(response => {
            this.teams1 = response.data;
            this.teams2 = response.data;
        });
        this.dashboardService.getTournaments({ page: 1, size: 100 }).subscribe(response => {
            this.tournaments = response.data;
        });
        if (this.dataSource.startDate) {
            this.gameStartTime = new Date(this.dataSource.startDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
        if (this.dataSource.endDate) {
            this.gameEndTime = new Date(this.dataSource.endDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
    }

    setDate(normalizedMonthAndYear: Moment, picker: MatDatepicker<Moment>): void {
        const ctrlValue = this.dataSource.startDate ? new Date(this.dataSource.startDate) : new Date();
        ctrlValue.setMonth(normalizedMonthAndYear.month());
        ctrlValue.setFullYear(normalizedMonthAndYear.year());
        this.dataSource.startDate = ctrlValue;
        this.dataSource.endDate = ctrlValue; // Assuming end date is same as start date initially
        picker.close();
    }

    setTeam1(teamId: string): void {
        this.selectedTeam1Id = teamId;
    }

    setTeam2(teamId: string): void {
        this.selectedTeam2Id = teamId;
        // Automatically set winner list based on team1 and team2 selection
        if (this.selectedTeam1Id && this.selectedTeam2Id) {
            this.winnerTeams = [this.teams1.find(team => team._id === this.selectedTeam1Id)!, this.teams2.find(team => team._id === this.selectedTeam2Id)!];
        }
    }

    onSave(): void {
        if (!this.dataSource.startDate || !this.gameStartTime || !this.gameEndTime || !this.selectedTournamentId || !this.selectedTeam1Id || !this.selectedTeam2Id) {
            this.matSnackBar.open('Bütün sahələri doldurun', 'Bağla', this.matSnackConfig);
            return;
        }

        this.dataSource.startDate = new Date(this.dataSource.startDate);
        this.dataSource.endDate = new Date(this.dataSource.startDate);
        const startTimeParts = this.gameStartTime.split(':');
        const endTimeParts = this.gameEndTime.split(':');
        this.dataSource.startDate.setHours(parseInt(startTimeParts[0], 10), parseInt(startTimeParts[1], 10));
        this.dataSource.endDate.setHours(parseInt(endTimeParts[0], 10), parseInt(endTimeParts[1], 10));
        this.dataSource.team1 = this.selectedTeam1Id;
        this.dataSource.team2 = this.selectedTeam2Id;
        this.dataSource.tournament = this.selectedTournamentId;
        this.dataSource.winner = this.selectedWinnerId;

        console.log('Saving Game:', this.dataSource);

        this.dialogRef.close(this.dataSource);
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
