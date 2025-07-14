import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CreateLocationDto, UpdateLocationDto } from '../../../../../core/models/location.model';
import { DashboardService } from '../../../services/dashboard.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-location-edit-dialog',
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
    templateUrl: './location-edit-dialog.component.html',
    styleUrl: './location-edit-dialog.component.scss'
})
export class LocationEditDialogComponent implements OnInit {
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    };
    
    constructor(
        public dialogRef: MatDialogRef<LocationEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: CreateLocationDto | UpdateLocationDto,
        private matSnackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        // Initialize any additional data or state if needed
    }

    onSave(): void {
        if (!this.dataSource.name || !this.dataSource.address || !this.dataSource.url) {
            this.matSnackBar.open('Bütün sahələri doldurun', 'Bağla', this.matSnackConfig);
            return;
        }

        this.dialogRef.close(this.dataSource);
    }

    onClose(): void {
        this.dialogRef.close();
    }

}
