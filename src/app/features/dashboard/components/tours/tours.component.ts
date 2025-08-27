import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Tour, TourResponse, CreateTourDto, UpdateTourDto } from '../../../../core/models/tour.model';
import { Tournament } from '../../../../core/models/tournament.model';
import { ConfirmDialogComponent } from '../../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { TourEditDialogComponent } from './tour-edit-dialog/tour-edit-dialog.component';

@Component({
    selector: 'app-tours',
    standalone: true,
    imports: [MatTableModule, MatButtonModule, CommonModule, MatSelectModule, MatIconModule, MatTooltipModule],
    templateUrl: './tours.component.html',
    styleUrl: './tours.component.scss'
})
export class ToursComponent implements OnInit {
    displayedColumns: string[] = ['name', 'tournament', 'startDate', 'endDate', 'actions'];
    dataSource: Tour[] = [];
    tournaments: Tournament[] = [];
    totalCount: number = 0;
    selectedTournament: string = '';
    
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }
    
    authorizedUserRole: string | null = null;

    isSuperAdmin$ = this.authService.isSuperAdmin$;
    isLevelUpUser$ = this.authService.isLevelUpUser$;
    isAdminOrSuperAdmin$ = this.authService.isAdminOrSuperAdmin$;

    constructor(
        private dashboardService: DashboardService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            if (isLoggedIn) {
                this.authorizedUserRole = this.authService.getRole();
                if (this.authorizedUserRole === 'admin' || this.authorizedUserRole === 'superadmin') {
                    this.loadTournaments();
                    this.loadTours();
                } else {
                    this.router.navigate(['/']);
                }
            } else {
                this.router.navigate(['/login']);
            }
        });
    }
    
    loadTours(): void {
        const params = {
            page: 1,
            size: 20,
            tournament: this.selectedTournament || undefined
        };
        
        this.dashboardService.getTours(params).subscribe({
            next: (data: TourResponse) => {
                this.dataSource = data.data;
                this.totalCount = data.totalCount;
            },
            error: (err) => {
                this.snackBar.open('Turların yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadTournaments(): void {
        this.dashboardService.getTournaments({ page: 1, size: 100 }).subscribe({
            next: (data) => {
                this.tournaments = data.data;
            },
            error: (err) => {
                this.snackBar.open('Turnirlərin yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    onTournamentFilterChange(): void {
        this.loadTours();
    }

    onTourCreate(): void {
        const newTour: CreateTourDto = {
            name: '',
            startDate: new Date(),
            endDate: new Date(),
            tournament: this.selectedTournament || this.tournaments[0]?._id || '',
            isNewTour: true
        };

        this.openEditDialog(newTour);
    }

    onTourUpdate(tour: Tour): void {
        const updateTour: UpdateTourDto = {
            _id: tour._id,
            name: tour.name,
            startDate: new Date(tour.startDate),
            endDate: new Date(tour.endDate),
            tournament: typeof tour.tournament === 'string' ? tour.tournament : tour.tournament._id,
            isNewTour: false
        };
        
        this.openEditDialog(updateTour);
    }

    onTourDelete(tour: Tour): void {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: { title: 'Silinməyə razılıq', text: 'Turu silmək istədiyinizdən əminsiniz mi?' }
        });

        confirmRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.dashboardService.deleteTour(tour._id).subscribe({
                    next: () => {
                        this.loadTours();
                        this.snackBar.open('Tur silindi', 'Bağla', this.matSnackConfig);
                    },
                    error: (error) => {
                        console.error(error);
                        this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    openEditDialog(tour: CreateTourDto | UpdateTourDto): void {
        const dialogRef = this.dialog.open(TourEditDialogComponent, {
            width: '600px',
            data: { tour: tour, tournaments: this.tournaments }
        });

        dialogRef.afterClosed().subscribe((result: CreateTourDto | UpdateTourDto) => {
            if (result) {
                if (result.isNewTour) {
                    this.dashboardService.createTour(result as CreateTourDto).subscribe({
                        next: () => {
                            this.loadTours();
                            this.snackBar.open('Tur yaradıldı', 'Bağla', this.matSnackConfig);
                        },
                        error: (error) => {
                            console.error(error);
                            this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                        }
                    });
                } else {
                    this.dashboardService.editTour(result as UpdateTourDto).subscribe({
                        next: () => {
                            this.loadTours();
                            this.snackBar.open('Tur məlumatları yeniləndi', 'Bağla', this.matSnackConfig);
                        },
                        error: (error) => {
                            console.error(error);
                            this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                        }
                    });
                }
            }
        });
    }

    getTournamentName(tournament: any): string {
        if (typeof tournament === 'string') {
            const found = this.tournaments.find(t => t._id === tournament);
            return found ? found.name : tournament;
        }
        return tournament?.name || 'N/A';
    }

    formatDate(date: Date | string): string {
        return new Date(date).toLocaleDateString('az-AZ');
    }
}
