import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import moment, { Moment } from 'moment';
import { MatInputModule } from '@angular/material/input';
import { CustomDateAdapter } from '../../../../utils/adapters/custom-date-adapter';
import { CUSTOM_DATE_FORMATS } from '../../../../utils/custom-date-formats';

@Component({
    selector: 'app-exam-add-dialog',
    standalone: true,
    imports: [
        MatFormFieldModule, MatInputModule,
        MatDialogContent, MatFormField, MatLabel, MatDialogActions, FormsModule, MatButtonModule, 
        MatDatepickerModule, MatDatepickerToggle, MatHint
    ],
    providers: [
        provideNativeDateAdapter(),
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }],
    templateUrl: './exam-add-dialog.component.html',
    styleUrl: './exam-add-dialog.component.scss'
})
export class ExamAddDialogComponent {
    readonly date = new FormControl(moment());
    
    constructor(
        public dialogRef: MatDialogRef<ExamAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { name: string; code: string, date: Date }
    ) {}

    onSave(): void {
        this.data.date = moment(this.date.value).toDate();
        this.dialogRef.close(this.data);
    }

    onClose(): void {
        this.dialogRef.close();
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date.setValue(ctrlValue);
        console.log(this.date);
        datepicker.close();
    }
}
