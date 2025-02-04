import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Student, StudentData } from '../../../../models/student.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { StudentService } from '../../services/student.service';
import { FilterParams } from '../../../../models/filterParams.model';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-students-list',
    standalone: true,
    imports: [
        CommonModule,
        MatSnackBarModule,
        MatIconModule,
        MatButtonModule,
        MatPaginator,
        MatFormFieldModule,
        FormsModule,
        MatOption,
        RouterModule,
        MatTableModule,
        ReactiveFormsModule
    ],
    templateUrl: './students-list.component.html',
    styleUrl: './students-list.component.scss'
})
export class StudentsListComponent {
    students: Student[] = [];
    totalCount: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    isLoading = false;
    hasError = false;
    errorMessage = '';
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    selectedDistrictIds: string[] = [];

    displayedColumns: string[] = ['lastName', 'firstName', 'middleName', 'code', 'grade', 'teacher', 'status'];

    constructor(
        private studentService: StudentService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.loadStudents();
    }

    loadStudents(): void {
        this.isLoading = true;
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize
        };
        this.studentService.getStudents(params).subscribe({
            next: (data: StudentData) => {
                this.students = data.data;
                this.totalCount = data.totalCount;
                this.isLoading = false;
            },
            error: (error) => {
                this.hasError = true;
                this.errorMessage = error.message;
                this.isLoading = false;
            }
        });
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadStudents();
    }

    openStudentDetails(studentId: string): void {
        this.studentService.getStudentById(studentId).subscribe({
            next: (student) => {
                console.log(student);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }
}
