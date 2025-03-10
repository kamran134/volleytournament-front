import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { District } from '../../../../models/district.model';
import { School } from '../../../../models/school.model';
import { Teacher } from '../../../../models/teacher.model';
import { Exam } from '../../../../models/exam.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MonthNamePipe } from '../../../../pipes/month-name.pipe';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-stats-filters',
    templateUrl: './stats-filters.component.html',
    styleUrls: ['./stats-filters.component.scss'],
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
        MatPaginatorModule,
        MatInputModule,
        MatTabsModule,
        MatSortModule,
        CommonModule,
        ReactiveFormsModule,
        MonthNamePipe,
        RouterModule
    ],
})
export class StatsFiltersComponent {
    @Input() selectedTab: string = 'students';
    @Input() districts: District[] = [];
    @Input() schools: School[] = [];
    @Input() teachers: Teacher[] = [];
    @Input() exams: Exam[] = [];
    @Input() gradesOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    @Input() monthControl = new FormControl(new Date());
    @Input() selectedDistrictIds: string[] = [];
    @Input() selectedSchoolIds: string[] = [];
    @Input() selectedTeacherIds: string[] = [];
    @Input() selectedGrades: number[] = [];
    @Input() selectedExamId: string = '';

    @Output() monthUpdated = new EventEmitter<string>();
    @Output() districtChanged = new EventEmitter<string[]>();
    @Output() schoolChanged = new EventEmitter<string[]>();
    @Output() teacherChanged = new EventEmitter<string[]>();
    @Output() gradeChanged = new EventEmitter<number[]>();
    @Output() examChanged = new EventEmitter<string>();

    updateMonth(event: any, datepicker: MatDatepicker<Date>) {
        const selectedDate = new Date(event);
        this.monthControl.setValue(selectedDate);
        if (!this.monthControl.value) return;
        const month = selectedDate.toISOString().slice(0, 7);
        this.monthUpdated.emit(month);
        datepicker.close();
    }

    onDistrictSelectChanged() {
        this.districtChanged.emit(this.selectedDistrictIds);
    }

    onSchoolSelectChanged() {
        this.schoolChanged.emit(this.selectedSchoolIds);
    }

    onTeacherSelectChanged() {
        this.teacherChanged.emit(this.selectedTeacherIds);
    }

    onGradeSelectChanged() {
        this.gradeChanged.emit(this.selectedGrades);
    }

    onExamSelectChanged() {
        this.examChanged.emit(this.selectedExamId);
    }
}