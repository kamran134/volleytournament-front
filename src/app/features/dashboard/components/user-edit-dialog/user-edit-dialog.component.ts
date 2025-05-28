import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserEdit } from '../../../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-user-edit-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        FormsModule,
        CommonModule
    ],
    templateUrl: './user-edit-dialog.component.html',
    styleUrl: './user-edit-dialog.component.scss'
})
export class UserEditDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<UserEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dataSource: UserEdit
    ) {
        console.log('UserEditDialogComponent initialized with data:', dataSource);
    }

    onSave(): void {
        this.dialogRef.close(this.dataSource);
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
