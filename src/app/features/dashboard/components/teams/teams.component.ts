import { Component, OnInit } from '@angular/core';
import { CreateTeamDto, Team, TeamResponse, UpdateTeamDto } from '../../../../core/models/team.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TeamEditDialogComponent } from './team-edit-dialog/team-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-teams',
    standalone: true,
    imports: [MatTableModule, MatButtonModule, CommonModule],
    templateUrl: './teams.component.html',
    styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
    displayedColumns: string[] = ['index', 'name', 'shortName', 'country', 'city', 'captain', 'tournaments', 'actions'];
    dataSource: Team[] = [];
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
                if (
                    this.authorizedUserRole === 'admin' || 
                    this.authorizedUserRole === 'superadmin' || 
                    this.authorizedUserRole === 'moderator' ||
                    this.authorizedUserRole === 'captain' ||
                    this.authorizedUserRole === 'coach'
                ) this.loadTeams();
                else this.router.navigate(['/']);
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    loadTeams(): void {
        this.dashboardService.getTeams({ page: 1, size: 10 }).subscribe({
            next: (data: TeamResponse) => {
                this.dataSource = data.data;
                this.totalCount = data.totalCount;
            },
            error: (err) => {
                this.snackBar.open('Komandaların yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    onTeamCreate(): void {
        const newTeam: CreateTeamDto = {
            name: '',
            shortName: undefined,
            country: 'Azerbaijan',
            city: 'Baku',
            logoUrl: undefined,
            logo: undefined,
            tournaments: [],
            isNewTeam: true
        };

        if (this.isAdminOrSuperAdmin$) this.openEditDialog(newTeam);
    }

    onTeamUpdate(team: Team): void {
        const updateTeam: UpdateTeamDto = {
            _id: team._id,
            isNewTeam: false,
            name: team.name,
            shortName: team.shortName,
            country: team.country,
            city: team.city,
            logoUrl: team.logoUrl,
            logo: undefined, // Logo can be updated separately
            tournaments: team.tournaments?.map(t => t._id) || [] // Safely handle undefined tournaments
        };
        
        if (this.isAdminOrSuperAdmin$) this.openEditDialog(updateTeam);
    }

    onTeamDelete(team: Team): void {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: { title: 'Silinməyə razılıq', text: 'DİQQƏT! Komanda silinərkən onun oyunçuları da silinir. Komandanı silmək istədiyinizdən əminsiniz mi?' }
        });

        confirmRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed && this.isAdminOrSuperAdmin$) {
                this.dashboardService.deleteTeam(team._id).subscribe({
                    next: () => {
                        this.loadTeams();
                        this.snackBar.open('Komanda silindi', 'Bağla', this.matSnackConfig);
                    },
                    error: (error) => {
                        console.error(error);
                        this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    openEditDialog(team: CreateTeamDto | UpdateTeamDto): void {
        const dialogRef = this.dialog.open(TeamEditDialogComponent, {
            width: '1000px',
            data: team
        });

        dialogRef.afterClosed().subscribe((result: CreateTeamDto | UpdateTeamDto) => {
            if (result) {
                if (result.isNewTeam) {
                    this.dashboardService.createTeam(result as CreateTeamDto).subscribe({
                        next: () => {
                            this.loadTeams();
                            this.snackBar.open('Komanda yaradıldı', 'Bağla', this.matSnackConfig);
                        },
                        error: (error) => {
                            console.error(error);
                            this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                        }
                    });
                } else {
                    this.dashboardService.editTeam(result as UpdateTeamDto).subscribe({
                        next: () => {
                            this.loadTeams();
                            this.snackBar.open('Komanda məlumatları yeniləndi', 'Bağla', this.matSnackConfig);
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

    // openTeamDetails(team: Team): void {
    //     const dialogRef = this.dialog.open(TeamEditDialogComponent, {
    //         width: '1000px',
    //         data: team
    //     });

    //     dialogRef.afterClosed().subscribe((result: Team) => {
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
