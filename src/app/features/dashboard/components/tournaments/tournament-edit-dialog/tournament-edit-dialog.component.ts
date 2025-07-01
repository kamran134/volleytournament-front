import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UpdateTournamentDto } from '../../../../../core/models/tournament.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';

@Component({
    selector: 'app-tournament-edit-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        FormsModule,
        CommonModule
    ],
    templateUrl: './tournament-edit-dialog.component.html',
    styleUrl: './tournament-edit-dialog.component.scss'
})
export class TournamentEditDialogComponent {
    repeatedPassword: string = '';
    emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    };

    constructor(
        public dialogRef: MatDialogRef<TournamentEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: UpdateTournamentDto,
        private matSnackBar: MatSnackBar,
        private authService: AuthService
    ) { }

    isSuperAdmin(): boolean {
        return this.authService.isSuperAdmin();
    }

    isNewTournament(): boolean {
        return !this.dataSource._id;
    }

    onSave(): void {
        // Create new tournament logic
        if (!this.dataSource.name || !this.dataSource.startDate || !this.dataSource.endDate) {
            this.matSnackBar.open('Ad, Başlanğıc Tarixi və Bitmə Tarixi seçilməlidir!', '', this.matSnackConfig);
            return;
        }
        if (this.dataSource.startDate >= this.dataSource.endDate) {
            this.matSnackBar.open('Başlanğıc Tarixi Bitmə Tarixindən əvvəl olmalıdır!', '', this.matSnackConfig);
            return;
        }
        // Additional validation for new tournament
        if (!this.dataSource.country || !this.dataSource.city) {
            this.dataSource.country = 'Azerbaijan'; // Default country
            this.dataSource.city = 'Baku'; // Default city
        }
        
        this.dialogRef.close(this.dataSource);
    }

    setStartDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
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

    onClose(): void {
        this.dialogRef.close();
    }
}
