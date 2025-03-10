import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-student-rating-table',
    templateUrl: './student-rating-table.component.html',
    styleUrls: ['../stats-main/stats.component.scss', './student-rating-table.component.scss'],
    imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule, CommonModule],
    standalone: true
})
export class StudentRatingTableComponent {
    @Input() title: string = "";
    @Input() dataSource: any[] = [];
    @Input() columns: string[] = [];
    @Input() tableName: 'developingStudents' | 'studentsOfMonth' | 'studentsOfMonthByRepublic' | 'allStudents' | 'allTeachers' | 'allSchools' | 'allDistricts' = 'developingStudents';
    @Output() rowClicked: EventEmitter<string> = new EventEmitter<string>();
    @Output() excelExport: EventEmitter<string> = new EventEmitter<string>();

    onRowClick(studentId: string): void {
        this.rowClicked.emit(studentId);
    }

    onExportToExcel(tableName: string): void {
        console.log('tableName', tableName);
        this.excelExport.emit(tableName);
    }
}