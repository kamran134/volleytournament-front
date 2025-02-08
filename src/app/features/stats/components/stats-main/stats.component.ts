import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsService } from '../../services/stats.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Error } from '../../../../models/error.model';

@Component({
    selector: 'app-stats',
    standalone: true,
    imports: [MatGridListModule, MatButtonModule, MatSnackBarModule],
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

    constructor(private statsService: StatsService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        console.log('StatsComponent initialized');
    }

    updateStats(): void {
        this.statsService.updateStats().subscribe({
            next: (response) => {
                this.snackBar.open('Statistika yeniləndi', 'OK', this.matSnackConfig);
            },
            error: (error: Error) => {
                this.snackBar.open(`Statistika yenilənərkən xəta baş verdi!\n${error.error.message}`, 'Bağla', this.matSnackConfig);
            }
        });
    }

    updateStatsByRepublic(): void {
        this.statsService.updateStatsByRepublic().subscribe({
            next: (response) => {
                this.snackBar.open('Respublika üzrə statistika yeniləndi', 'OK', this.matSnackConfig);
            },
            error: (error: Error) => {
                this.snackBar.open(`Respublika üzrə statistika yenilənərkən xəta baş verdi!\n${error.error.message}`, 'Bağla', this.matSnackConfig);
            }
        });
    }
}
