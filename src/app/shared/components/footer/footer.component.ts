import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatIconModule,
    ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    currentYear: number = new Date().getFullYear();

    constructor() {
        // You can add any initialization logic here if needed
    }
}
