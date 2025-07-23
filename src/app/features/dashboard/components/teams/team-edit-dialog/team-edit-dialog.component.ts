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
import { CreateTeamDto, UpdateTeamDto } from '../../../../../core/models/team.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { Tournament } from '../../../../../core/models/tournament.model';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
    selector: 'app-team-edit-dialog',
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
    templateUrl: './team-edit-dialog.component.html',
    styleUrl: './team-edit-dialog.component.scss'
})
export class TeamEditDialogComponent implements OnInit {
    selectedTournamentIds: string[] = [];
    tournaments: Tournament[] = [];
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    };
    previewUrl: string | null = null;
    imageUrl: string = '';

    constructor(
        public dialogRef: MatDialogRef<TeamEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: CreateTeamDto | UpdateTeamDto,
        private matSnackBar: MatSnackBar,
        private authService: AuthService,
        private dashboardService: DashboardService
    ) {
        if (dataSource.logoUrl) {
            // this.previewUrl = dataSource.logoUrl;
            this.imageUrl = `${dataSource.logoUrl}`;
        }
    }

    ngOnInit(): void {
        // Initialize tournaments if needed
        this.dashboardService.getTournaments({ page: 1, size: 100 }).subscribe(response => {
            this.tournaments = response.data;
            if (this.dataSource.tournaments) {
                this.selectedTournamentIds = this.dataSource.tournaments;
            }
        });
    }

    isSuperAdmin(): boolean {
        return this.authService.isSuperAdmin();
    }

    isNewTeam(): boolean {
        return !('_id' in this.dataSource && this.dataSource._id);
    }

    getUserId(): string | null {
        return this.authService.getUserId();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.dataSource.logo = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.dataSource.logoUrl = e.target.result;
                this.previewUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onSave(): void {
        // Create new tournament logic
        if (!this.dataSource.name) {
            this.matSnackBar.open('Ad mütləq yazılmalıdır!', '', this.matSnackConfig);
            return;
        }
        
        // Additional validation for new tournament
        if (!this.dataSource.country || !this.dataSource.city) {
            this.dataSource.country = 'Azerbaijan'; // Default country
            this.dataSource.city = 'Baku'; // Default city
        }

        if (this.selectedTournamentIds.length > 0) {
            this.dataSource.tournaments = this.selectedTournamentIds;
        }

        this.dataSource.createdBy = this.getUserId()!;
        this.dialogRef.close(this.dataSource);
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
