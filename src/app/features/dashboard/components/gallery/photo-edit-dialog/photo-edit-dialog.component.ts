import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Tournament } from '../../../../../core/models/tournament.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';
import { UpdatePhotoDto } from '../../../../../core/models/photo.model';
import { Tour } from '../../../../../core/models/tour.model';
import { Team } from '../../../../../core/models/team.model';

@Component({
    selector: 'app-photo-edit-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './photo-edit-dialog.component.html',
    styleUrl: './photo-edit-dialog.component.scss'
})
export class PhotoEditDialogComponent implements OnInit {
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
    };

    tournaments: Tournament[] = [];
    tours: Tour[] = [];
    teams: Team[] = [];

    tournamentId: string = '';
    tourId: string = '';
    teamIds: string[] = [];

    previewUrl: string | null = null;

    constructor(
        public dialogRef: MatDialogRef<PhotoEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: UpdatePhotoDto, // Adjust type as necessary
        private matSnackBar: MatSnackBar,
        private authService: AuthService,
        private dashboardService: DashboardService
    ) { }
    
    ngOnInit(): void {
        this.loadTournaments();
        this.loadTours();
        this.loadTeams();
        this.tournamentId = this.dataSource.tournament?._id || '';
        this.tourId = this.dataSource.tour?._id || '';
        this.teamIds = this.dataSource.teams?.map(team => team._id) || [];
    }

    loadTournaments(): void {
        this.dashboardService.getTournaments({ page: 1, size: 100 }).subscribe({
            next: (response) => {
                this.tournaments = response.data;
                this.teams = this.tournaments.find(t => t._id === this.tournamentId)?.teams || [];
                this.loadTours();
            },
            error: (error) => {
                this.matSnackBar.open('Turnirlər yüklənərkən xəta baş verdi.', '', this.matSnackConfig);
            }
        });
    }

    loadTours(): void {
        if (!this.tournamentId) {
            this.matSnackBar.open('Turnir seçilməyib.', '', this.matSnackConfig);
            return;
        }
        this.dashboardService.getTours({ tournament: this.tournamentId, page: 1, size: 100 }).subscribe({
            next: (response) => {
                this.tours = response.data;
            },
            error: (error) => {
                this.matSnackBar.open('Turlar yüklənərkən xəta baş verdi.', '', this.matSnackConfig);
            }
        });
    }

    loadTeams(): void {
        if (!this.tournamentId) {
            this.matSnackBar.open('Turnir seçilməyib.', '', this.matSnackConfig);
            return;
        }
        this.teams = this.tournaments.find(t => t._id === this.tournamentId)?.teams || [];
    }

    isSuperAdmin(): boolean {
        return this.authService.isSuperAdmin();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.dataSource.file = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                //this.dataSource.logoUrl = e.target.result;
                this.previewUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onChangeTournament(): void {
        this.loadTours();
        this.loadTeams();
    }

    onSave(): void {
        // Create new tournament logic
        if (!this.dataSource.description || (!this.previewUrl && !this.dataSource.url) || !this.tournamentId || !this.tourId) {
            this.matSnackBar.open('Şəkil təsviri, önizləmə URL-i, turnir və ya tur seçilməyib.', '', this.matSnackConfig);
            return;
        }
        // Additional validation for new tournament
        this.dialogRef.close(this.dataSource);
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
