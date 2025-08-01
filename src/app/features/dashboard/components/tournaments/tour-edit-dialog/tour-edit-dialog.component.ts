import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CreateTourDto, UpdateTourDto } from '../../../../../core/models/tour.model';
import { AuthService } from '../../../../../core/services/auth.service';
import moment, { Moment } from 'moment';
import { Tournament } from '../../../../../core/models/tournament.model';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
    selector: 'app-tour-edit-dialog',
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
    templateUrl: './tour-edit-dialog.component.html',
    styleUrl: './tour-edit-dialog.component.scss'
})
export class TourEditDialogComponent implements OnInit {
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
    };
    tournaments: Tournament[] = [];
    tournamentId: string = '';

    constructor(
        public dialogRef: MatDialogRef<TourEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: CreateTourDto | UpdateTourDto,
        private matSnackBar: MatSnackBar,
        private authService: AuthService,
        private dashboardService: DashboardService
    ) { }

    ngOnInit(): void {
        this.loadTournaments();
        if (this.dataSource.isNewTour) {
            this.tournamentId = (this.dataSource as CreateTourDto).tournament;
        }
        else {
            this.tournamentId = (this.dataSource as UpdateTourDto).tournament._id;
        }
    }

    loadTournaments(): void {
        this.dashboardService.getTournaments({ page: 1, size: 100 }).subscribe({
            next: (response) => {
                this.tournaments = response.data;
            },
            error: (error) => {
                this.matSnackBar.open('Turnirlər yüklənərkən xəta baş verdi.', '', this.matSnackConfig);
            }
        });
    }

    isSuperAdmin(): boolean {
        return this.authService.isSuperAdmin();
    }

    setStartDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
        const ctrlValue = this.dataSource.startDate ? moment(this.dataSource.startDate) : moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.dataSource.startDate = ctrlValue.toDate();
        datepicker.close();
    }

    setEndDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.dataSource.endDate ? moment(this.dataSource.endDate) : moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.dataSource.endDate = ctrlValue.toDate();
        datepicker.close();
    }

    onSave(): void {
        if (!this.dataSource.startDate || !this.dataSource.endDate) {
            this.matSnackBar.open('Başlama və bitmə tarixləri seçilməlidir.', '', this.matSnackConfig);
            return;
        }

        if (this.dataSource.startDate > this.dataSource.endDate) {
            this.matSnackBar.open('Başlama tarixi bitmə tarixindən sonra ola bilməz.', '', this.matSnackConfig);
            return;
        }

        if (this.dataSource.name.trim() === '') {
            this.matSnackBar.open('Turun adı boş ola bilməz.', '', this.matSnackConfig);
            return;
        }
        
        this.dialogRef.close(this.dataSource);
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
