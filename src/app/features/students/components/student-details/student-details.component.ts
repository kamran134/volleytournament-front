import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentWithResult } from '../../../../models/student.model';
import { Error } from '../../../../models/error.model';
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

    constructor(private studentService: StudentService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.studentId = params['id']!;
            this.loadStudent();
        });
    }

    private loadStudent(): void {
        this.studentService.getStudentById(this.studentId).subscribe({
            next: (data) => {
                this.student = data;
                console.log('student: ', this.student);
            },
            error: (error: Error) => {
                console.error('Şagirdin alınmasında xəta!', error.error);
                this.student = null;
            }
        });
    }
}
