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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { MonthNamePipe } from '../../../../pipes/month-name.pipe';

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
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        ReactiveFormsModule,
        MonthNamePipe,
        RouterModule
    ],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
    monthControl = new FormControl(new Date());
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
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

        const selectedDate = this.monthControl.value;
        if (!selectedDate) return;

        const month = selectedDate.toISOString().slice(0, 7);

        this.statsService.getStats(month).subscribe({
            next: (response) => {
                this.loading = false;
                this.stats = response;
            },
            error: (error: Error) => {
                this.loading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
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
                this.snackBar.open(`${error.error.message}`, 'Bağla', this.matSnackConfig);
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
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    updateMonth(event: Date) {
        this.monthControl.setValue(event, { emitEvent: true });
        this.getStats();
    }
}
