import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsService } from '../../services/stats.service';

@Component({
    selector: 'app-stats',
    standalone: true,
    imports: [MatGridListModule, MatButtonModule],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent {
    constructor(private statsService: StatsService) {}

    ngOnInit(): void {
        console.log('StatsComponent initialized');
    }

    updateStats(): void {
        this.statsService.updateStats();
        console.log('Stats updated');
    }
}
