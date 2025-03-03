import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-student-table',
    templateUrl: './student-table.component.html',
    styleUrls: ['./stats.component.scss'],
    imports: [MatCardModule, MatTableModule, CommonModule],
    standalone: true
})
export class StudentTableComponent {
    @Input() title: string = "";
    @Input() dataSource: any[] = [];
    @Input() columns: string[] = [];
    @Output() rowClicked: EventEmitter<string> = new EventEmitter<string>();

    onRowClick(studentId: string): void {
        this.rowClicked.emit(studentId);
    }
}