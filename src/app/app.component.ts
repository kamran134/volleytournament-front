import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, MatButtonModule, MatIconModule, MatSlideToggleModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title: string = 'Şagirdlərin qiymətləndirilmə sistemi';
    darkMode: boolean = false;

    ngOnInit(): void {
        if (typeof localStorage !== 'undefined') {
            this.darkMode = localStorage.getItem('theme') === 'true';
            this.setMode();
        }
    }

    darkModeToogleChanged(): void {
        this.darkMode = !this.darkMode;
        localStorage.setItem('theme', this.darkMode.toString());
        this.setMode();

    }

    setMode(): void {    
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
            
        } else {
            document.body.classList.remove('dark-mode');
        }

        const tables = document.querySelectorAll('.table');
        tables.forEach(table => {
            if (this.darkMode) {
                table.classList.add('dark-mode');
            } else {
                table.classList.remove('dark-mode');
            }
        });
    }
}
