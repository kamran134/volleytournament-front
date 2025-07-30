import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Tournament } from '../../../../../core/models/tournament.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Tour } from '../../../../../core/models/tour.model';
import { Team } from '../../../../../core/models/team.model';
import { CreatePhotosDto } from '../../../../../core/models/photo.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
    selector: 'app-photo-add-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule
    ],
    templateUrl: './photo-add-dialog.component.html',
    styleUrl: './photo-add-dialog.component.scss'
})
export class PhotoAddDialogComponent implements OnInit {
    selectedTournamentId: string = '';
    selectedTourId: string = '';
    selectedTeamIds: string[] = [];
    tournaments: Tournament[] = [];
    tours: Tour[] = [];
    teams: Team[] = [];

    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    };
    previewUrls: string[] = [];
    imageUrl: string = '';

    constructor(
        public dialogRef: MatDialogRef<PhotoAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: CreatePhotosDto,
        private matSnackBar: MatSnackBar,
        private authService: AuthService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.loadInitialData();
    }

    private loadInitialData(): void {
        this.dashboardService.getTournaments({}).subscribe(response => {
            this.tournaments = response.data;
        });

        this.dashboardService.getTours({ page: 1, size: 100 }).subscribe(response => {
            this.tours = response.data;
        });

        this.dashboardService.getTeams({}).subscribe(response => {
            this.teams = response.data;
        });
    }

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.dataSource.files = Array.from(input.files);
            this.previewUrls = this.dataSource.files.map(file => URL.createObjectURL(file));
        }
    }

    onTournamentChange(tournamentId: string): void {
        this.selectedTournamentId = tournamentId;
    }

    onTourChange(tourId: string): void {
        this.selectedTourId = tourId;
    }

    onTeamsChange(teamIds: string[]): void {
        this.selectedTeamIds = teamIds; // Update the dataSource with selected teams
    }

    onClose(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.dataSource.files.length === 0) {
            this.matSnackBar.open('Zəhmət olmasa, ən azı bir foto əlavə edin.', '', this.matSnackConfig);
            return;
        }
        if (!this.selectedTournamentId || !this.selectedTourId) {
            this.matSnackBar.open('Turnir və tur seçilməlidir.', '', this.matSnackConfig);
            return;
        }
        this.dataSource.tournament = this.selectedTournamentId;
        this.dataSource.tour = this.selectedTourId;
        this.dataSource.teams = this.selectedTeamIds;

        this.dialogRef.close(this.dataSource);
    }
}
