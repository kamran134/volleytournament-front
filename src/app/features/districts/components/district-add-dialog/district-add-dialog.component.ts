import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { District } from '../../../../models/district.model';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-district-add-dialog',
    standalone: true,
    imports: [MatDialogContent, MatFormField, MatLabel, MatDialogActions, FormsModule, MatButtonModule],
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
}
