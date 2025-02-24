import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsService } from '../../services/stats.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { Error } from '../../../../models/error.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Stats } from '../../../../models/stats.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MonthNamePipe } from '../../../../pipes/month-name.pipe';
import { MatSelectModule } from '@angular/material/select';
import { Exam } from '../../../../models/exam.model';
import { ExamService } from '../../../exams/services/exam.service';

@Component({
    selector: 'app-stats',
    standalone: true,
    imports: [
        MatGridListModule,
        MatButtonModule,
        MatSnackBarModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatTableModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        CommonModule,
        ReactiveFormsModule,
        MonthNamePipe,
        RouterModule
    ],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
    monthControl = new FormControl(new Date());
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }
    loading: boolean = false;
    loading1: boolean = false;
    stats: Stats = {};
    columns: string[] = ["fullName", "district", "teacher", "score"];
    selectedExamId: string = '';
    exams: Exam[] = [];
    errorMessage: string = '';

    constructor(private statsService: StatsService, private snackBar: MatSnackBar, private examService: ExamService) {}

    ngOnInit(): void {
        this.loadExams();
        this.getStats();
    }

    getStats(): void {
        this.loading = true;
        this.stats = {};

        const selectedDate = this.monthControl.value;
        if (!selectedDate) return;

        const month = selectedDate.toISOString().slice(0, 7);
        
        this.statsService.getStats(month).subscribe({
            next: (response) => {
                this.loading = false;
                this.stats = response;
            },
            error: (error: Error) => {
                this.loading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        })
    }

    getStatsByExam(): void {
        this.loading = true;
        this.stats = {};

        this.statsService.getStatsByExam(this.selectedExamId).subscribe({
            next: (response) => {
                this.loading = false;
                this.stats = response;
            },
            error: (error: Error) => {
                this.loading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadExams(): void {
        this.examService.getExams({ page: 0, size: 1000 })
            .subscribe({
                next: (response) => {
                    this.exams = response.data
                },
                error: (err: any) => {
                    this.errorMessage = '';
                }
            });
    }

    updateStats(): void {
        this.loading1 = true;
        this.statsService.updateStats().subscribe({
            next: (response) => {
                this.loading1 = false;
                this.snackBar.open('Statistika yeniləndi', 'OK', this.matSnackConfig);
            },
            error: (error: Error) => {
                this.loading1 = false;
                this.snackBar.open(`${error.error.message}`, 'Bağla', this.matSnackConfig);
            }
        });
    }

    updateMonth(event: any, datepicker: MatDatepicker<Date>) {
        const selectedDate = new Date(event);
        this.monthControl.setValue(selectedDate);
        datepicker.close();
        this.getStats();
    }

    onExamSelectChanged(): void {
        this.getStatsByExam();
    }
}
