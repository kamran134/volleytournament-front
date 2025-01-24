import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MomentDateFormatPipe } from '../../../../pipes/moment-date-format.pipe';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-exam-result-dialog',
    standalone: true,
    imports: [MomentDateFormatPipe, MatDialogModule, MatButtonModule],
    templateUrl: './exam-result-dialog.component.html',
    styleUrl: './exam-result-dialog.component.scss',
})
export class ExamResultDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<ExamResultDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {
        console.log(this.data);
    }

    addResults(): void {
        
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
