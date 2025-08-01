import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Tournament } from '../../../../core/models/tournament.model';
import { Tour } from '../../../../core/models/tour.model';
import { Team, TeamResponse } from '../../../../core/models/team.model';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Photo, UpdatePhotoDto } from '../../../../core/models/photo.model';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { PhotoAddDialogComponent } from './photo-add-dialog/photo-add-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { MatCheckbox } from "@angular/material/checkbox";
import { FormsModule } from '@angular/forms';
import { PhotoEditDialogComponent } from './photo-edit-dialog/photo-edit-dialog.component';

@Component({
    selector: 'app-gallery',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        MatIconModule,
        MatSnackBarModule,
        MatCheckbox,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit{
    selectedTournaments: string[] = [];
    selectedTours: string[] = [];
    selectedTeams: string[] = [];

    tournaments: Tournament[] = [];
    tours: Tour[] = [];
    teams: Team[] = [];

    dataSource: Photo[] = [];
    totalCount: number = 0;
    displayedColumns: string[] = ['index', 'photo', 'tournament', 'tour', 'actions'];
    isAdminOrSuperAdmin$ = this.authService.isAdminOrSuperAdmin$;

    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }

    selectAll: boolean = false;

    constructor(
        private authService: AuthService,
        private dashboardService: DashboardService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            if (isLoggedIn) {
                const role = this.authService.getRole();
                if (role === 'admin' || role === 'superadmin' || role === 'moderator') {
                    this.loadTournaments();
                    this.loadTours();
                    this.loadTeams();
                    this.loadPhotos();
                } else {
                    this.router.navigate(['/']);
                }
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    loadTeams(): void {
        this.dashboardService.getTeams({ page: 1, size: 10 }).subscribe({
            next: (data: TeamResponse) => {
                this.teams = data.data;
                this.totalCount = data.totalCount;
            },
            error: (err) => {
                this.snackBar.open('Komandaların yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadTournaments(): void {
        this.dashboardService.getTournaments({ page: 1, size: 10 }).subscribe({
            next: (data) => {
                this.tournaments = data.data;
            },
            error: (err) => {
                this.snackBar.open('Turnirlərin yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadTours(): void {
        this.dashboardService.getTours({ page: 1, size: 10 }).subscribe({
            next: (data) => {
                this.tours = data.data;
            },
            error: (err) => {
                this.snackBar.open('Turların yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadPhotos(): void {
        const filters = {
            tournaments: this.selectedTournaments,
            tours: this.selectedTours,
            teams: this.selectedTeams,
            page: 1,
            size: 10
        };

        this.dashboardService.getPhotos(filters).subscribe({
            next: (data) => {
                this.dataSource = data.data;
                this.totalCount = data.totalCount;
                this.selectAll = false; // Reset select all after loading new data
                // временный показ фото в локале
                // this.dataSource = this.dataSource.map(photo => ({
                //     ...photo,
                //     url: 'https://volleytour.az/' + photo.url // Пример добавления базового URL
                // }));
            },
            error: (err) => {
                this.snackBar.open('Şəkillərin yüklənməsində xəta baş verdi: ' + err.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    onTournamentChange(tournamentIds: string[]): void {
        console.log('Selected Tournament IDs:', tournamentIds);
        this.selectedTournaments = tournamentIds;
        this.loadPhotos();
    }

    onTourChange(tourIds: string[]): void {
        this.selectedTours = tourIds;
        this.loadPhotos();
    }

    onTeamChange(teamIds: string[]): void {
        this.selectedTeams = teamIds;
        this.loadPhotos();
    }

    onAddPhoto(): void {
        const dialogRef = this.dialog.open(PhotoAddDialogComponent, {
            width: '600px',
            data: {
                tournaments: this.tournaments,
                tours: this.tours,
                teams: this.teams
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.dashboardService.createPhotos(result).subscribe({
                    next: () => {
                        this.snackBar.open('Foto(lar) əlavə edildi!', '', this.matSnackConfig);
                        this.loadPhotos();
                    },
                    error: (err) => {
                        this.snackBar.open('Foto(lar) əlavə edilmədi: ' + err.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    onPhotoUpdate(photo: Photo): void {
        const updatePhoto: UpdatePhotoDto = {
            _id: photo._id,
            description: photo.description,
            tournament: photo.tournament,
            tour: photo.tour,
            teams: photo.teams,
            url: photo.url
        };

        const dialogRef = this.dialog.open(PhotoEditDialogComponent, {
            width: '600px',
            data: updatePhoto
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.dashboardService.editPhoto(result).subscribe({
                    next: () => {
                        this.snackBar.open('Foto məlumatları yeniləndi', 'Bağla', this.matSnackConfig);
                        this.loadPhotos();
                    },
                    error: (error) => {
                        console.error(error);
                        this.snackBar.open('Foto məlumatları yenilənmədi: ' + error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    onPhotoDelete(photo: Photo): void {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: { title: 'Silinməyə razılıq', text: 'Şəkli silmək istədiyinizdən əminsiniz mi?' }
        });

        confirmRef.afterClosed().subscribe(result => {
            if (result) {
                this.dashboardService.deletePhoto(photo._id).subscribe({
                    next: () => {
                        this.snackBar.open('Foto silindi!', '', this.matSnackConfig);
                        this.loadPhotos();
                    },
                    error: (err) => {
                        this.snackBar.open('Foto silinmədi: ' + err.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    onDeleteSelected(): void {
        const selectedPhotos = this.dataSource.filter(photo => photo.selected);
        if (selectedPhotos.length === 0) {
            this.snackBar.open('Heç bir foto seçilməyib!', 'Bağla', this.matSnackConfig);
            return;
        }
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: { title: 'Silinməyə razılıq', text: 'Seçilmiş şəkilləri silmək istədiyinizdən əminsiniz mi?' }
        });

        confirmRef.afterClosed().subscribe(result => {
            if (result) {
                const ids = selectedPhotos.map(photo => photo._id);
                this.dashboardService.deletePhotos(ids).subscribe({
                    next: () => {
                        this.snackBar.open('Seçilmiş fotolar silindi!', '', this.matSnackConfig);
                        this.loadPhotos();
                    },
                    error: (err) => {
                        this.snackBar.open('Fotolar silinmədi: ' + err.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    onPhotoSelect(photo: Photo, isSelected: boolean): void {
        photo.selected = isSelected;
    }

    onSelectAllChange(isSelected: boolean): void {
        this.selectAll = isSelected;
        this.dataSource.forEach(photo => {
            photo.selected = isSelected;
        });
    }

    hasNoSelectedPhotos(): boolean {
        return this.dataSource.every(photo => !photo.selected);
    }
}
