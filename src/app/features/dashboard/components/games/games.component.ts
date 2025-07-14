import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CreateGameDto, Game, UpdateGameDto } from '../../../../core/models/game.model';
import { Team } from '../../../../core/models/team.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { GameEditDialogComponent } from './game-edit-dialog/game-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { AzeDateTimePipe } from '../../../../shared/pipes/aze-date-time.pipe';

@Component({
    selector: 'app-games',
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        CommonModule,
        AzeDateTimePipe,
    ],
    templateUrl: './games.component.html',
    styleUrl: './games.component.scss'
})
export class GamesComponent {
    displayedColumns: string[] = ['tournament', 'team1', 'team2', 'score', 'winner', 'startDate', 'endDate', 'actions'];
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

    openEditDialog(game: CreateGameDto | UpdateGameDto): void {
        const dialogRef = this.dialog.open(GameEditDialogComponent, {
            width: '1000px',
            data: game
        });

        dialogRef.afterClosed().subscribe((result: CreateGameDto | UpdateGameDto) => {
            if (result) {
                if (result.isNewGame) {
                    this.dashboardService.createGame(result).subscribe({
                        next: () => {
                            this.snackBar.open('Oyun yaradıldı', '', this.matSnackConfig);
                            this.loadGames();
                        },
                        error: (err) => {
                            this.snackBar.open('Oyun yaradılmadı: ' + err.message, '', this.matSnackConfig);
                        }
                    });
                } else {
                    this.dashboardService.editGame(result).subscribe({
                        next: () => {
                            this.snackBar.open('Oyun yeniləndi', '', this.matSnackConfig);
                            this.loadGames();
                        },
                        error: (err) => {
                            this.snackBar.open('Oyun yenilənmədi: ' + err.message + ': ' + err.error.message, '', this.matSnackConfig);
                        }
                    });
                }
            }
        });
    }

    onGameCreate(): void {
        const newGame: CreateGameDto = {
            name: '',
            startDate: new Date(),
            endDate: new Date(),
            tournament: '',
            team1: '',
            team2: '',
            location: '',
            isNewGame: true,
            
        };
        this.openEditDialog(newGame);
    }

    onGameUpdate(game: Game): void {
        const updateGame: UpdateGameDto = {
            _id: game._id,
            name: game.name,
            startDate: game.startDate,
            endDate: game.endDate,
            tournament: game.tournament,
            team1: game.team1,
            team2: game.team2,
            scoreTeam1: game.scoreTeam1,
            scoreTeam2: game.scoreTeam2,
            winner: game.winner,
            location: game.location,
            isNewGame: false,
        };
        this.openEditDialog(updateGame);
    }

    onGameDelete(game: Game): void {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Oyun silinsin?',
                text: 'Bu oyunu silmək istədiyinizə əminsinizmi?'
            }
        });

        confirmRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.dashboardService.deleteGame(game._id).subscribe({
                    next: () => {
                        this.snackBar.open('Oyun silindi', '', this.matSnackConfig);
                        this.loadGames();
                    },
                    error: (err) => {
                        this.snackBar.open('Oyun silinmədi: ' + err.message, '', this.matSnackConfig);
                    }
                });
            }
        });
    }

    onPageChange(event: any): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadGames();
    }
}
