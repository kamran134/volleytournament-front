import { Component, OnInit } from '@angular/core';
import { School, SchoolData } from '../../../../models/school.model';
import { SchoolService } from '../../services/school.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarModule,
    MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FilterParams } from '../../../../models/filterParams.model';
import { District, DistrictData } from '../../../../models/district.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistrictService } from '../../../districts/services/district.service';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../layouts/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-schools-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatSnackBarModule,
        MatButtonModule,
        MatIconModule,
        MatPaginator,
        MatFormFieldModule,
        MatTableModule,
        MatSelectModule,
        MatOption,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './schools-list.component.html',
    styleUrl: './schools-list.component.scss'
})
export class SchoolsListComponent implements OnInit {
    file: File | null = null;
    schools: School[] = [];
    districts: District[] = [];
    totalCount: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    isLoading = false;
    hasError = false;
    errorMessage = '';
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    selectedDistrictIds: string[] = [];

    constructor(
        private schoolService: SchoolService,
        private districtService: DistrictService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog) {}

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input?.files?.length) {
            this.file = input.files[0];
        }
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        if (this.file) {
            this.schoolService.uploadFile(this.file).subscribe({
                next: (response) => this.snackBar.open('Fayl uğurla yükləndi', 'OK', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    duration: 5000
                }),
                error: (err) => this.snackBar.open(`Fayl yüklənməsində xəta!\n${err.message}`, 'Bağla', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    duration: 5000
                })
            });
        }
        else {
            this.snackBar.open('Fayl seçilməyib', 'Bağla', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 5000
            });
        }
    }

    onSelectChanged(): void {
        this.loadSchools()
    }

    ngOnInit(): void {
        this.loadDistricts();
        this.loadSchools();
    }

    loadSchools(): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            districtIds: this.selectedDistrictIds.join(",")
        };
        
        this.isLoading = true;
        this.schoolService.getSchools(params)
            .subscribe({
                next: (data: SchoolData) => {
                    this.schools = data.data;
                    this.totalCount = data.totalCount;
                    this.isLoading = false;
                },
                error: (err: any) => {
                    this.isLoading = false;
                    this.hasError = true;
                    this.errorMessage = `Error fetching schools: ${err.message}`;
                }
            });
    }

    loadDistricts(): void {
        this.districtService.getDistricts()
            .subscribe({
                next: (response: DistrictData) => {
                    this.districts = response.data;
                },
                error: (err: any) => {
                    this.isLoading = false;
                    this.hasError = true;
                    this.errorMessage = `Error fetching districts: ${err.message};`
                }
            });
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadSchools();
    }

    onAllSchoolsDelete(): void {

        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: { title: 'Silinməyə razılıq', text: 'Bütün məktəbləri silmək istədiyinizdən əminsiniz mi?' }
        });

        confirmRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                const schoolIds = this.schools.map(s => s._id).join(",");
                this.schoolService.deleteSchools(schoolIds).subscribe({
                    next: (response) => {
                        this.loadSchools();
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            }
        });
    }
}
