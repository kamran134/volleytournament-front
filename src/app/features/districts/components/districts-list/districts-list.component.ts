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

@Component({
    selector: 'app-districts-list',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatInputModule],
    templateUrl: './districts-list.component.html',
    styleUrls: ['./districts-list.component.scss']
})
export class DistrictsListComponent implements OnInit {
    districts: District[] = [];
    isLoading = false;
    hasError = false;
    errorMessage = '';
    data: any;

    constructor(private dialog: MatDialog, private districtService: DistrictService) {}

    ngOnInit(): void {
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

    openAddDistrictDialog(): void {
        const dialogRef = this.dialog.open(DistrictAddDialogComponent, {
          width: '400px',
          data: { name: '', code: '' },
        });
    
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.districtService.addDistrict(result).subscribe(() => {
                this.ngOnInit();
                // Обнови список районов, если нужно
              });
            }
        });
    }
}
