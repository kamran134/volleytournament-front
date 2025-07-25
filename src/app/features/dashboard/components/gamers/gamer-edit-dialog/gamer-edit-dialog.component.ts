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
import { Team } from '../../../../../core/models/team.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UpdateGamerDto } from '../../../../../core/models/gamer.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';
import moment, { Moment } from 'moment';

@Component({
    selector: 'app-gamer-edit-dialog',
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
    templateUrl: './gamer-edit-dialog.component.html',
    styleUrl: './gamer-edit-dialog.component.scss'
})
export class GamerEditDialogComponent implements OnInit {
    emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
    selectedTeamId: string = '';
    teams: Team[] = [];
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    };

    constructor(
        public dialogRef: MatDialogRef<GamerEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: UpdateGamerDto,
        private matSnackBar: MatSnackBar,
        private authService: AuthService,
        private dashboardService: DashboardService
    ) { }

    ngOnInit(): void {
        const filter = {};
        // Initialize teams if needed
        if (this.isSuperAdmin()) {
            // If the user is a super admin, fetch all teams
            this.dashboardService.getTeams({ page: 1, size: 100 }).subscribe(response => {
                this.teams = response.data;
                if (this.dataSource.team) {
                    this.selectedTeamId = this.dataSource.team;
                }
            });
        } else {
            this.dashboardService.getTeams({ page: 1, size: 100, createdBy: this.getUserId()! }).subscribe(response => {
                this.teams = response.data;
                if (this.dataSource.team) {
                    this.selectedTeamId = this.dataSource.team;
                }
            });
        }
        
    }

    isSuperAdmin(): boolean {
        return this.authService.isSuperAdmin();
    }

    isNewGamer(): boolean {
        return !this.dataSource._id;
    }

    getUserId(): string | null {
        return this.authService.getUserId();
    }

    onSave(): void {
        // Create new tournament logic
        if (!this.dataSource.team && !this.selectedTeamId) {
            this.matSnackBar.open('Komanda mütləq seçilməlidir!', '', this.matSnackConfig);
            return;
        }

        if (!this.dataSource.number) {
            this.matSnackBar.open('Nömrə mütləq yazılmalıdır!', '', this.matSnackConfig);
            return;
        }

        if (Number.isNaN(this.dataSource.number) || this.dataSource.number < 0) {
            this.matSnackBar.open('Nömrə düzgün deyil!', '', this.matSnackConfig);
            return;
        }

        if (!this.dataSource.firstName || !this.dataSource.lastName) {
            this.matSnackBar.open('Ad və soyad mütləq yazılmalıdır!', '', this.matSnackConfig);
            return;
        }

        if (this.selectedTeamId) {
            this.dataSource.team = this.selectedTeamId;
        }

        if (this.dataSource.email && !new RegExp(this.emailPattern).test(this.dataSource.email)) {
            this.matSnackBar.open('Email formatı düzgün deyil!', '', this.matSnackConfig);
            return;
        }

        this.dataSource.number = Number(this.dataSource.number);
        this.dataSource.height = this.dataSource.height ? Number(this.dataSource.height) : undefined;
        this.dataSource.team = this.dataSource.team ? this.dataSource.team : this.selectedTeamId;
        
        this.dialogRef.close(this.dataSource);
    }

    setBirthDate(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.dataSource.birthDate ? moment(this.dataSource.birthDate) : moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.dataSource.birthDate = ctrlValue.toDate();
        datepicker.close();
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
