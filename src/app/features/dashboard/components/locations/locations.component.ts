import { Component } from '@angular/core';
import { CreateLocationDto, Location, UpdateLocationDto } from '../../../../core/models/location.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocationEditDialogComponent } from './location-edit-dialog/location-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-locations',
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        CommonModule,
    ],
    templateUrl: './locations.component.html',
    styleUrl: './locations.component.scss'
})
export class LocationsComponent {
    displayedColumns: string[] = ['name', 'address', 'url', 'actions'];
    dataSource: Location[] = [];
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
                    this.loadLocations();
                } else {
                    this.router.navigate(['/admin/tournaments']);
                }
            } else {
                this.authService.logout(); // Выполняем logout, если токен истёк или пользователь не авторизован
                this.router.navigate(['/login']);
            }
        });
    }

    loadLocations(): void {
        console.log('Loading locations...');
        this.dashboardService.getLocations({ page: this.pageIndex + 1, size: this.pageSize }).subscribe({
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

    openEditDialog(location: CreateLocationDto | UpdateLocationDto): void {
        const dialogRef = this.dialog.open(LocationEditDialogComponent, {
            width: '1000px',
            data: location
        });

        dialogRef.afterClosed().subscribe((result: CreateLocationDto | UpdateLocationDto) => {
            if (result) {
                if (result.isNewLocation) {
                    console.log('Creating new location:', result);
                    this.dashboardService.createLocation(result as CreateLocationDto).subscribe({
                        next: () => {
                            console.log('Location created successfully');
                            this.snackBar.open('Məkan yaradıldı', '', this.matSnackConfig);
                            this.loadLocations();
                        },
                        error: (err) => {
                            this.snackBar.open('Məkan yaradılmadı: ' + err.message, '', this.matSnackConfig);
                        }
                    });
                } else {
                    this.dashboardService.editLocation(result as UpdateLocationDto).subscribe({
                        next: () => {
                            this.snackBar.open('Məkan yeniləndi', '', this.matSnackConfig);
                            this.loadLocations();
                        },
                        error: (err) => {
                            this.snackBar.open('Məkan yenilənmədi: ' + err.message + ': ' + err.error.message, '', this.matSnackConfig);
                        }
                    });
                }
            }
        });
    }

    onLocationCreate(): void {
        const newLocation: CreateLocationDto = {
            name: '',
            address: '',
            url: '',
            latitude: 0,
            longitude: 0,
            isNewLocation: true
        };
        this.openEditDialog(newLocation);
    }

    onLocationUpdate(location: Location): void {
        const updateLocation: UpdateLocationDto = {
            _id: location._id,
            name: location.name,
            address: location.address,
            url: location.url,
            latitude: location.latitude,
            longitude: location.longitude,
            isNewLocation: false
        };
        this.openEditDialog(updateLocation);
    }

    onLocationDelete(location: Location): void {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Məkan silinsin?',
                text: 'Bu məkanı silmək istədiyinizə əminsinizmi?'
            }
        });

        confirmRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.dashboardService.deleteLocation(location._id).subscribe({
                    next: () => {
                        this.snackBar.open('Məkan silindi', '', this.matSnackConfig);
                        this.loadLocations();
                    },
                    error: (err) => {
                        this.snackBar.open('Məkan silinmədi: ' + err.message, '', this.matSnackConfig);
                    }
                });
            }
        });
    }

    onPageChange(event: any): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadLocations();
    }
}
