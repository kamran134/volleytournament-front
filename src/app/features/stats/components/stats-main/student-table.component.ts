import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
}