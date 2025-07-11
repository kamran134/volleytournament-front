import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CreateTournamentDto, Tournament, TournamentResponse, UpdateTournamentDto } from '../../../../core/models/tournament.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { TournamentEditDialogComponent } from './tournament-edit-dialog/tournament-edit-dialog.component';

@Component({
    selector: 'app-tournaments',
    standalone: true,
    imports: [MatTableModule, MatButtonModule, CommonModule],
    templateUrl: './tournaments.component.html',
    styleUrl: './tournaments.component.scss'
})
export class TournamentsComponent implements OnInit {
    displayedColumns: string[] = ['name', 'country', 'city', 'startDate', 'endDate', 'actions'];
    dataSource: Tournament[] = [];
    totalCount: number = 0;
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
        // Initial load of users or rating columns based on user role
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            if (isLoggedIn) {
                this.authorizedUserRole = this.authService.getRole();
                if (this.authorizedUserRole === 'admin' || this.authorizedUserRole === 'superadmin' || this.authorizedUserRole === 'coach' || this.authorizedUserRole === 'captain') this.loadTournaments();
                else this.router.navigate(['/']);
            } else {
                this.router.navigate(['/login']);
            }
        });
    }
    
    loadTournaments(): void {
        this.dashboardService.getTournaments({ page: 1, size: 10 }).subscribe({
            next: (data: TournamentResponse) => {
                this.dataSource = data.data;
                this.totalCount = data.totalCount;
            },
            error: (err) => {
                this.snackBar.open('Yarışların yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    onTournamentCreate(): void {
        const newTournament: CreateTournamentDto = {
            name: '',
            shortName: undefined,
            country: '',
            city: '',
            startDate: new Date(),
            endDate: new Date(),
            logo: undefined,
            logoUrl: undefined,
            isNewTournament: true
        };

        this.openEditDialog(newTournament);
    }

    onTournamentUpdate(tournament: Tournament): void {
        const updateTournament: UpdateTournamentDto = {
            _id: tournament._id,
            isNewTournament: false,
            name: tournament.name,
            shortName: tournament.shortName,
            logoUrl: tournament.logoUrl,
            country: tournament.country,
            city: tournament.city,
            startDate: new Date(tournament.startDate),
            endDate: new Date(tournament.endDate),
            statut: tournament.statut,
            teams: tournament.teams?.map(team => team._id) || []
        };
        if (this.isAdminOrSuperAdmin$) this.openEditDialog(updateTournament);
    }

    onTournamentDelete(tournament: Tournament): void {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: { title: 'Silinməyə razılıq', text: 'Turniri silmək istədiyinizdən əminsiniz mi?' }
        });

        confirmRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed && this.isAdminOrSuperAdmin$) {
                this.dashboardService.deleteTournament(tournament._id).subscribe({
                    next: () => {
                        this.loadTournaments();
                        this.snackBar.open('Turnir silindi', 'Bağla', this.matSnackConfig);
                    },
                    error: (error) => {
                        console.error(error);
                        this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    openEditDialog(tournament: CreateTournamentDto | UpdateTournamentDto): void {
        const dialogRef = this.dialog.open(TournamentEditDialogComponent, {
            width: '1000px',
            data: tournament
        });

        dialogRef.afterClosed().subscribe((result: CreateTournamentDto | UpdateTournamentDto) => {
            if (result) {
                if (result.isNewTournament) {
                    this.dashboardService.createTournament(result as CreateTournamentDto).subscribe({
                        next: () => {
                            this.loadTournaments();
                            this.snackBar.open('Turnir yaradıldı', 'Bağla', this.matSnackConfig);
                        },
                        error: (error) => {
                            console.error(error);
                            this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                        }
                    });
                } else {
                    this.dashboardService.editTournament(result as UpdateTournamentDto).subscribe({
                        next: () => {
                            this.loadTournaments();
                            this.snackBar.open('Turnir məlumatları yeniləndi', 'Bağla', this.matSnackConfig);
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

    openTournamentDetails(tournament: Tournament): void {
        // const dialogRef = this.dialog.open(TournamentEditDialogComponent, {
        //     width: '1000px',
        //     data: tournament
        // });

        // dialogRef.afterClosed().subscribe((result: Tournament) => {
        //     if (result) {
        //         this.dashboardService.editTournament(result).subscribe({
        //             next: () => {
        //                 this.loadTournaments();
        //             },
        //             error: (error) => {
        //                 console.error(error);
        //                 this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
        //             }
        //         });
        //     }
        // });
    }
}
