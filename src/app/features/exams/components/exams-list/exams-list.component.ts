import { Component, OnInit } from '@angular/core';
import {
    MatSnackBarHorizontalPosition,
    MatSnackBarModule,
    MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { FilterParams } from '../../../../models/filterParams.model';
import { Exam, ExamData } from '../../../../models/exam.model';
import { MatDialog } from '@angular/material/dialog';
import { ExamAddDialogComponent } from '../exam-add-dialog/exam-add-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ExamResultDialogComponent } from '../exam-result-dialog/exam-result-dialog.component';
// import { MomentDateFormatPipe } from '../../../../pipes/moment-date-format.pipe';

@Component({
    selector: 'app-exams-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatSnackBarModule,
        MatIconModule,
        MatButtonModule,
        MatPaginator,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        // MomentDateFormatPipe
    ],
    templateUrl: './exams-list.component.html',
    styleUrl: './exams-list.component.scss'
})
export class ExamsListComponent implements OnInit {
    constructor(private examService: ExamService, private dialog: MatDialog,) {}

    displayedColumns: string[] = ['name', 'code', 'date'];

    exams: Exam[] = [];
    totalCount: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    isLoading = false;
    hasError = false;
    errorMessage = '';
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    selectedDistrictIds: string[] = [];

    ngOnInit(): void {
        this.loadExams();
    }

    loadExams(): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            districtIds: this.selectedDistrictIds.join(",")
        };
        
        this.isLoading = true;
        this.examService.getExams(params)
            .subscribe({
                next: (data: ExamData) => {
                    this.exams = data.data;
                    this.totalCount = data.totalCount;
                    this.isLoading = false;
                },
                error: (err: any) => {
                    this.isLoading = false;
                    this.hasError = true;
                    this.errorMessage = `Error fetching exams: ${err.message}`;
                }
            });
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadExams();
    }

    openAddExamDialog() {
        const dialogRef = this.dialog.open(ExamAddDialogComponent, {
            width: '400px',
            data: { name: '', code: '', date: '' },
        });
    
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.examService.addExam(result).subscribe(() => {
                    this.ngOnInit();
                    // Обнови список районов, если нужно
                });
            }
        });
    }

    openExamDetails(exam: Exam) {
        const dialogRef = this.dialog.open(ExamResultDialogComponent, {
            width: '800px',
            data: { exam: exam },
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }
}
