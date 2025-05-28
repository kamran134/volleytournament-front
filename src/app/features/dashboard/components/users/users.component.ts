import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { User, UserData, UserEdit } from '../../../../core/models/user.model';
import { DashboardService } from '../../services/dashboard.service';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [MatTableModule, MatButtonModule],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
    displayedColumns: string[] = ['id', 'email', 'role', 'active', 'actions'];
    dataSource: User[] = [];
    totalCount: number = 0;
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }

    constructor(private dashboardService: DashboardService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        // Initial load of users
        this.loadUsers();
    }

    loadUsers(): void {
        this.dashboardService.getUsers({ page: 1, size: 10 }).subscribe({
            next: (data: UserData) => {
                this.dataSource = data.data;
                this.totalCount = data.totalCount;
            },
            error: (err) => {
                console.error('Error loading users:', err);
            }
        });
    }

    onUserUpdate(user: User): void {
        const dialogRef = this.dialog.open(UserEditDialogComponent, {
            width: '1000px',
            data: user
        });

        dialogRef.afterClosed().subscribe((result: UserEdit) => {
            if (result) {
                this.dashboardService.editUser(result).subscribe({
                    next: () => {
                        this.loadUsers();
                        this.snackBar.open('İstifadəçi məlumatları yeniləndi', 'Bağla', this.matSnackConfig);
                    },
                    error: (error) => {
                        console.error(error);
                        this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }

    openUserDetails(user: User): void {
        const dialogRef = this.dialog.open(UserEditDialogComponent, {
            width: '1000px',
            data: user
        });

        dialogRef.afterClosed().subscribe((result: UserEdit) => {
            if (result) {
                this.dashboardService.editUser(result).subscribe({
                    next: () => {
                        this.loadUsers();
                    },
                    error: (error) => {
                        console.error(error);
                        this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                    }
                });
            }
        });
    }
}
