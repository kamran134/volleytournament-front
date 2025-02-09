import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsService } from '../../services/stats.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Error } from '../../../../models/error.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-stats',
    standalone: true,
    imports: [
        MatGridListModule,
        MatButtonModule,
        MatSnackBarModule,
        MatIconModule,
        MatProgressSpinnerModule,
        CommonModule,
        RouterModule],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent {
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
    }
    loading1: boolean = false;
    loading2: boolean = false;

    constructor(private statsService: StatsService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        console.log('StatsComponent initialized');
    }

    updateStats(): void {
        this.loading1 = true;
        this.statsService.updateStats().subscribe({
            next: (response) => {
                this.loading1 = false;
                this.snackBar.open('Statistika yeniləndi', 'OK', this.matSnackConfig);
            },
            error: (error: Error) => {
                this.loading1 = false;
                this.snackBar.open(`Statistika yenilənərkən xəta baş verdi!\n${error.error.message}`, 'Bağla', this.matSnackConfig);
            }
        });
    }

    updateStatsByRepublic(): void {
        this.loading2 = true;
        this.statsService.updateStatsByRepublic().subscribe({
            next: (response) => {
                this.loading2 = false;
                this.snackBar.open('Respublika üzrə statistika yeniləndi', 'OK', this.matSnackConfig);
            },
            error: (error: Error) => {
                this.loading2 = false;
                this.snackBar.open(`Respublika üzrə statistika yenilənərkən xəta baş verdi!\n${error.error.message}`, 'Bağla', this.matSnackConfig);
            }
        });
    }
}
