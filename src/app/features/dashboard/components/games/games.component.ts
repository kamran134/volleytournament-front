import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Game } from '../../../../core/models/game.model';
import { Team } from '../../../../core/models/team.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-games',
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        CommonModule
    ],
    templateUrl: './games.component.html',
    styleUrl: './games.component.scss'
})
export class GamesComponent {
    displayedColumns: string[] = ['name', 'tournament', 'team1', 'team2', 'startDate', 'endDate', 'actions'];
    dataSource: Game[] = [];
    teams1: Team[] = [];
    teams2: Team[] = [];
    selectedTeams: string[] = [];
    totalCount: number = 0;
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    };
    authorizedUserRole: string | null = null;
    pageSize: number = 20;
    pageIndex: number = 0;
    pageSizeOptions: number[] = [10, 20, 50, 100];
    isLoading: boolean = false;

    isAdminOrSuperAdmin$ = this.authService.isAdminOrSuperAdmin$;

    constructor(
        private dashboardService: DashboardService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Initial load of games
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            if (isLoggedIn && this.authService.checkTokenValidity()) {
                this.authorizedUserRole = this.authService.getRole();
                if (this.authorizedUserRole === 'admin' || this.authorizedUserRole === 'superadmin') {
                    this.loadGames();
                } else {
                    this.router.navigate(['/admin/tournaments']);
                }
            } else {
                this.authService.logout(); // Выполняем logout, если токен истёк или пользователь не авторизован
                this.router.navigate(['/login']);
            }
        });
    }

    loadGames(): void {
        this.isLoading = true;
        this.dashboardService.getGames({ page: this.pageIndex + 1, size: this.pageSize }).subscribe({
            next: (data) => {
                this.dataSource = data.data;
                this.totalCount = data.totalCount;
                this.isLoading = false;
            },
            error: (err) => {
                this.snackBar.open('Xəta baş verdi', 'Bağla', this.matSnackConfig);
                console.error(err);
                this.isLoading = false;
            }
        });
    }

}
