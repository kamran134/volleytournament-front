import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { District } from '../../../../models/district.model';
import { DistrictService } from '../../services/district.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { DistrictAddDialogComponent } from '../district-add-dialog/district-add-dialog.component';
import { ResponseFromBackend } from '../../../../models/response.model';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-districts-list',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatInputModule, MatTableModule, MatSnackBarModule],
    templateUrl: './districts-list.component.html',
    styleUrls: ['./districts-list.component.scss']
})
export class DistrictsListComponent implements OnInit {
    districts: District[] = [];
    isLoading = false;
    hasError = false;
    errorMessage = '';
    data: any;
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }

    constructor(private dialog: MatDialog, private districtService: DistrictService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.loadDistricts();
    }

    openAddDistrictDialog(): void {
        const dialogRef = this.dialog.open(DistrictAddDialogComponent, {
          width: '400px',
          data: { name: '', code: '' },
        });
    
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.districtService.addDistrict(result).subscribe({
                    next: (response: ResponseFromBackend) => {
                        this.isLoading = false;
                        this.snackBar.open(response.message || '', 'OK', this.matSnackConfig);
                        this.loadDistricts();
                    },
                    error: (error) => {
                        this.isLoading = false;
                        this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    loadDistricts(): void {
        this.isLoading = true;
        this.districtService.getDistricts()
            .subscribe({
                next: (data: any) => {
                    this.districts = data;
                    this.isLoading = false;
                },
                error: (err: any) => {
                    this.isLoading = false;
                    this.hasError = true;
                    this.errorMessage = `Error fetching districts:  ${err.message}`;
                }
            });
    }
}
