import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-district-add-dialog',
    standalone: true,
    imports: [
        MatDialogContent, MatFormFieldModule, MatInputModule,
        MatFormField, MatLabel, MatDialogActions, FormsModule, MatButtonModule],
    templateUrl: './district-add-dialog.component.html',
    styleUrl: './district-add-dialog.component.scss'
})
export class DistrictAddDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DistrictAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { name: string; code: string }
    ) {}

    onSave(): void {
        this.dialogRef.close(this.data);
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
