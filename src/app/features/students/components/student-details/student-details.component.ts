import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { StudentWithResult } from '../../../../core/models/student.model';
import { Error } from '../../../../core/models/error.model';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-student-details',
    standalone: true,
    imports: [
        MatCardModule, MatDividerModule, MatTableModule, MatProgressSpinner, MatIconModule, MatButtonModule, 
        RouterModule,
        CommonModule
    ],
    templateUrl: './student-details.component.html',
    styleUrl: './student-details.component.scss'
})
export class StudentDetailsComponent implements OnInit {
    studentId!: string;
    student!: StudentWithResult | null;
    prevPageSize: number = 10;
    prevPageIndex: number = 0;
    filterParams: any = {};
    source: string = 'students';

    constructor(private studentService: StudentService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.studentId = params['id']!;
            this.loadStudent();
        });

        this.route.queryParams.subscribe((params: Params) => {
            this.prevPageSize = params['pageSize'] ? +params['pageSize'] : this.prevPageSize;
            this.prevPageIndex = params['pageIndex'] ? +params['pageIndex'] : this.prevPageIndex;
            this.filterParams = params;
            this.source = params['source'] || 'students'
        });
    }

    private loadStudent(): void {
        this.studentService.getStudentById(this.studentId).subscribe({
            next: (data) => {
                this.student = data;
            },
            error: (error: Error) => {
                console.error('Şagirdin alınmasında xəta!', error.error);
                this.student = null;
            }
        });
    }
}
