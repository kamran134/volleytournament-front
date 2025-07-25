import { Component, OnInit } from '@angular/core';
import { CreateGamerDto, Gamer, GamerResponse, UpdateGamerDto } from '../../../../core/models/gamer.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { GamerEditDialogComponent } from './gamer-edit-dialog/gamer-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Team, TeamResponse } from '../../../../core/models/team.model';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-gamers',
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        CommonModule
    ],
    templateUrl: './gamers.component.html',
    styleUrl: './gamers.component.scss'
})
export class GamersComponent implements OnInit{
    displayedColumns: string[] = ['number', 'lastName', 'firstName', 'team', 'role', 'actions'];
    dataSource: Gamer[] = [];
    teams: Team[] = [];
    selectedTeams: string[] = [];
    totalCount: number = 0;
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }
    authorizedUserRole: string | null = null;
    pageSize: number = 20;
    pageIndex: number = 0;
    pageSizeOptions: number[] = [10, 20, 50, 100];
    isLoading: boolean = false;

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
                if (
                    this.authorizedUserRole === 'admin' ||
                    this.authorizedUserRole === 'superadmin' ||
                    this.authorizedUserRole === 'moderator' ||
                    this.authorizedUserRole === 'captain' ||
                    this.authorizedUserRole === 'coach'
                ) {
                    this.loadGamers();
                    this.loadTeams();
                }
                else this.router.navigate(['/']);
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    loadGamers(): void {
        this.dashboardService.getGamers({ page: this.pageIndex, size: this.pageSize, teams: this.selectedTeams }).subscribe({
            next: (data: GamerResponse) => {
                this.dataSource = data.data;
                this.totalCount = data.totalCount;
            },
            error: (err) => {
                this.snackBar.open('Oyunçuların yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadTeams(): void {
        this.dashboardService.getTeams({ page: 1, size: 10 }).subscribe({
            next: (data: TeamResponse) => {
                this.teams = data.data;
            },
            error: (err) => {
                this.snackBar.open('Komandaların yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    onGamerCreate(): void {
        const dialogRef = this.dialog.open(GamerEditDialogComponent, {
            width: '1000px',
            data: {
                number: null,
                lastName: '',
                firstName: '',
                middleName: '',
                birthDate: null,
                height: null,
                email: '',
                role: '',
                isCaptain: false,
                isCoach: false,
                team: null
            }
        });

        dialogRef.afterClosed().subscribe((result: CreateGamerDto) => {
            if (result) {
                this.dashboardService.createGamer(result).subscribe({
                    next: () => {
                        this.loadGamers();
                        this.snackBar.open('Yeni oyunçu yaradıldı', 'Bağla', this.matSnackConfig);
                    },
                    error: (error) => {
                        console.error(error);
                        this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    onGamerUpdate(gamer: Gamer): void {
        if (
            this.authorizedUserRole === 'admin' ||
            this.authorizedUserRole === 'superadmin' ||
            this.authorizedUserRole === 'moderator' ||
            this.authorizedUserRole === 'captain' ||
            this.authorizedUserRole === 'coach'
        ) this.openEditDialog(gamer);
    }

    onGamerDelete(gamer: Gamer): void {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: { title: 'Silinməyə razılıq', text: 'Oyunçunu silmək istədiyinizdən əminsiniz mi?' }
        });

        confirmRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed && this.isAdminOrSuperAdmin$) {
                this.dashboardService.deleteGamer(gamer._id).subscribe({
                    next: () => {
                        this.loadGamers();
                        this.snackBar.open('Oyunçu silindi', 'Bağla', this.matSnackConfig);
                    },
                    error: (error) => {
                        console.error(error);
                        this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    openEditDialog(gamer: Gamer): void {
        const dialogRef = this.dialog.open(GamerEditDialogComponent, {
            width: '1000px',
            data: {
                ...gamer,
                team: gamer.team ? gamer.team._id : null // Ensure team is set to its ID
            }
        });

        dialogRef.afterClosed().subscribe((result: UpdateGamerDto) => {
            if (result) {
                this.dashboardService.editGamer(result).subscribe({
                    next: () => {
                        this.loadGamers();
                        this.snackBar.open('Oyunçu məlumatları yeniləndi', 'Bağla', this.matSnackConfig);
                    },
                    error: (error) => {
                        console.error(error);
                        this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    onPageChange(event: any): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadGamers();
    }

    onTeamFilterChange(selectedTeams: string[]): void {
        this.selectedTeams = selectedTeams;
        this.loadGamers();
    }

    onFilterReset(): void {
        this.selectedTeams = [];
        this.loadGamers();
    }

    // openGamerDetails(gamer: Gamer): void {
    //     const dialogRef = this.dialog.open(GamerEditDialogComponent, {
    //         width: '1000px',
    //         data: gamer
    //     });

    //     dialogRef.afterClosed().subscribe((result: GamerEditDialogComponent) => {
    //         if (result) {
    //             this.dashboardService.editTournament(result).subscribe({
    //                 next: () => {
    //                     this.loadTeams();
    //                 },
    //                 error: (error) => {
    //                     console.error(error);
    //                     this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
    //                 }
    //             });
    //         }
    //     });
    // }
}
