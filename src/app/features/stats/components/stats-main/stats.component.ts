import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsService } from '../../services/stats.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Error } from '../../../../models/error.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Stats } from '../../../../models/stats.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-stats',
    standalone: true,
    imports: [
        MatGridListModule,
        MatButtonModule,
        MatSnackBarModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatTableModule,
        CommonModule,
        RouterModule
    ],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
    }
    loading: boolean = false;
    loading1: boolean = false;
    loading2: boolean = false;
    stats: Stats = {}

    constructor(private statsService: StatsService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.getStats();
    }

    getStats(): void {
        this.loading = true;
        this.statsService.getStats().subscribe({
            next: (response) => {
                this.loading = false;
                this.stats = response;
            },
            error: (error: Error) => {
                this.loading = false;
                this.snackBar.open(`Statistikanın yüklənməsi zamanı xəta baş verdi!\n${error.error.message}`, 'Bağla', this.matSnackConfig);
            }
        })
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
