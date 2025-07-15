import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from "./shared/components/layout/layout.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [      
        LayoutComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
