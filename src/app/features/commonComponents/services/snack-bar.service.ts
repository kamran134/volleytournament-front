import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { SnackBarComponent } from "../snack-bar/snack-bar.component";

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {
    private defaultConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }
    
    constructor(private snackBar: MatSnackBar) { }

    show(message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info'): void {
        this.snackBar.openFromComponent(SnackBarComponent, {
            ...this.defaultConfig,
            data: { message, type }
        });
    }
}