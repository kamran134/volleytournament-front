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
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CreateTourDto, UpdateTourDto } from '../../../../../core/models/tour.model';
import { Tournament } from '../../../../../core/models/tournament.model';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
    selector: 'app-tour-edit-dialog',
    standalone: true,
    imports: [
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './tour-edit-dialog.component.html',
    styleUrl: './tour-edit-dialog.component.scss'
})
export class TourEditDialogComponent implements OnInit {
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
    };

    constructor(
        public dialogRef: MatDialogRef<TourEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) 
        public data: { 
            tour: CreateTourDto | UpdateTourDto; 
            tournaments: Tournament[] 
        },
        private matSnackBar: MatSnackBar,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        // Initialize tournament selection
        if (this.data.tour.isNewTour && !this.data.tour.tournament && this.data.tournaments.length > 0) {
            this.data.tour.tournament = this.data.tournaments[0]._id;
        }
    }

    get tour(): CreateTourDto | UpdateTourDto {
        return this.data.tour;
    }

    get tournaments(): Tournament[] {
        return this.data.tournaments;
    }

    isSuperAdmin(): boolean {
        return this.authService.isSuperAdmin();
    }

    onSave(): void {
        if (!this.tour.startDate || !this.tour.endDate) {
            this.matSnackBar.open('Başlama və bitmə tarixləri seçilməlidir.', '', this.matSnackConfig);
            return;
        }

        if (this.tour.startDate > this.tour.endDate) {
            this.matSnackBar.open('Başlama tarixi bitmə tarixindən sonra ola bilməz.', '', this.matSnackConfig);
            return;
        }

        if (!this.tour.name || this.tour.name.trim() === '') {
            this.matSnackBar.open('Turun adı boş ola bilməz.', '', this.matSnackConfig);
            return;
        }

        if (!this.tour.tournament) {
            this.matSnackBar.open('Turnir seçilməlidir.', '', this.matSnackConfig);
            return;
        }
        
        this.dialogRef.close(this.tour);
    }

    onClose(): void {
        this.dialogRef.close();
    }

    getTournamentName(tournamentId: string): string {
        const tournament = this.tournaments.find(t => t._id === tournamentId);
        return tournament ? tournament.name : tournamentId;
    }
}
