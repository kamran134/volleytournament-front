import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, MatIcon],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
