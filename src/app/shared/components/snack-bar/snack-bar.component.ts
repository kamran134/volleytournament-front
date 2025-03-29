import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-snack-bar',
    standalone: true,
    imports: [MatSnackBarModule, CommonModule],
    templateUrl: './snack-bar.component.html',
    styleUrl: './snack-bar.component.scss'
})
export class SnackBarComponent {
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}