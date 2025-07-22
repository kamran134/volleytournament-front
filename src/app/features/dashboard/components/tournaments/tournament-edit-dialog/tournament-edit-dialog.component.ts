import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CreateTournamentDto, UpdateTournamentDto } from '../../../../../core/models/tournament.model';
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
import { ConfigService } from '../../../../../core/services/config.service';
import { QuillModule } from 'ngx-quill';

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
        QuillModule,
        CommonModule
    ],
    templateUrl: './tournament-edit-dialog.component.html',
    styleUrl: './tournament-edit-dialog.component.scss'
})
export class TournamentEditDialogComponent {
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    };
    previewUrl: string | null = null;
    baseUrl: string = this.configService.getApiUrl();
    imageUrl: string = '';

    constructor(
        public dialogRef: MatDialogRef<TournamentEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: CreateTournamentDto | UpdateTournamentDto,
        private matSnackBar: MatSnackBar,
        private authService: AuthService,
        private configService: ConfigService
    ) {
        if (dataSource.logoUrl) {
            // this.previewUrl = dataSource.logoUrl;
            this.imageUrl = `${this.baseUrl.replace('/api', '')}${dataSource.logoUrl}`;
        }
    }

    isSuperAdmin(): boolean {
        return this.authService.isSuperAdmin();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.dataSource.logo = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                //this.dataSource.logoUrl = e.target.result;
                this.previewUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
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
        this.dataSource.country = this.dataSource.country || 'Azerbaijan';
        this.dataSource.city = this.dataSource.city || 'Baku';
        this.dataSource.shortName = this.dataSource.shortName || this.dataSource.name;
        this.dataSource.statute = this.dataSource.statute || '';
        this.dataSource.isActive = this.dataSource.isActive !== undefined ? this.dataSource.isActive : true;
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
