import { Component, OnInit } from '@angular/core';
import { Teacher, TeacherData } from '../../../../models/teacher.model';
import { TeacherService } from '../../services/teacher.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilterParams } from '../../../../models/filterParams.model';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistrictService } from '../../../districts/services/district.service';
import { SchoolService } from '../../../schools/services/school.service';
import { District, DistrictData } from '../../../../models/district.model';
import { School, SchoolData } from '../../../../models/school.model';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogComponent } from '../../../../layouts/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../services/auth.service';
import { RepairingResults } from '../../../../models/student.model';

@Component({
    selector: 'app-teachers-list',
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
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './teachers-list.component.html',
    styleUrl: './teachers-list.component.scss'
})
export class TeachersListComponent implements OnInit {
    file: File | null = null;
    teachers: Teacher[] = [];
    districts: District[] = [];
    schools: School[] = [];
    totalCount: number = 0;
    pageSize: number = 100;
    pageIndex: number = 0;
    isLoading = false;
    hasError = false;
    errorMessage = '';
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }
    selectedDistrictIds: string[] = [];
    selectedSchoolIds: string[] = [];
    missingSchoolCodes: number[] = [];
    teacherCodesWithoutSchoolCodes: number[] = [];
    incorrectTeacherCodes: number[] = [];
    repairingResults: RepairingResults = {};

    constructor(
        private teacherService: TeacherService,
        private districtService: DistrictService,
        private schoolService: SchoolService,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {}

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input?.files?.length) {
            this.file = input.files[0]
        }
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        if (this.file) {
            this.teacherService.uploadFile(this.file).subscribe({
                next: (response) => {
                    this.snackBar.open(response.message || 'Fayl uğurla yükləndi', 'OK', this.matSnackConfig);
                    this.missingSchoolCodes = response.missingSchoolCodes || [];
                    this.teacherCodesWithoutSchoolCodes = response.teacherCodesWithoutSchoolCodes || [];
                    this.incorrectTeacherCodes = response.incorrectTeacherCodes || [];
                },
                error: (err) => this.snackBar.open(`Fayl yüklənməsində xəta!\n${err.message}`, 'Bağla', this.matSnackConfig)
            });
        }
        else {
            this.snackBar.open('Fayl seçilməyib', 'Bağla', this.matSnackConfig);
        }
    }

    onDistrictSelectChanged(): void {
        this.loadSchools();
        this.loadTeachers();
    }

    onSchoolSelectChanged(): void {
        this.loadTeachers();
    }

    ngOnInit(): void {
        this.loadDistricts();
        this.loadTeachers();
    }

    isAdminOrSuperAdmin(): boolean {
        return this.authService.isAdminOrSuperAdmin();
    }

    loadTeachers(): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            districtIds: this.selectedDistrictIds.join(","),
            schoolIds: this.selectedSchoolIds.join(","),
        }

        this.isLoading = true;
        this.teacherService.getTeachers(params)
            .subscribe({
                next: (response: TeacherData) => {
                    this.teachers = response.data;
                    this.totalCount = response.totalCount
                    this.isLoading = false;
                },
                error: (err: any) => {
                    this.isLoading = false;
                    this.hasError = true;
                    this.errorMessage = `Error fetching teachers: ${err.message}`;
                }
            });
    }

    loadSchools(): void {
        const params: FilterParams = {
            districtIds: this.selectedDistrictIds.join(",")
        }

        this.schoolService.getSchoolsForFilter(params)
            .subscribe({
                next: (data: SchoolData) => {
                    this.schools = data.data;
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
                    this.errorMessage = `Error fetching districts: ${err.message}`;
                }
            });
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadTeachers();
    }

    onTeachersRepair(): void {
        this.isLoading = true;
        this.teacherService.repairTeachers().subscribe({
            next: (response) => {
                this.repairingResults = response;
                this.snackBar.open(response.message || '', 'OK', this.matSnackConfig);
                this.isLoading = false;
            },
            error: (error) => {
                console.error(error);
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                this.isLoading = false;
            }
        });
    }

    onAllTeachersDelete(): void {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: { title: 'Silinməyə razılıq', text: 'Bütün müəllimləri silmək istədiyinizdən əminsiniz mi?' }
        });

        confirmRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                const teacherIds = this.teachers.map(s => s._id).join(",");
                this.teacherService.deleteTeachers(teacherIds).subscribe({
                    next: (response) => {
                        this.loadTeachers();
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            }
        });
    }
}
