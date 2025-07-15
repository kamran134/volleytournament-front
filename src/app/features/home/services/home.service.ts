import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { Tournament } from '../../../core/models/tournament.model';
import { Game } from '../../../core/models/game.model';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getTournaments() {
        const apiUrl = this.configService.getApiUrl();
        return this.http.get<{ data: Tournament[] }>(`${apiUrl}/tournaments`);
    }

    getUpcomingGames() {
        const apiUrl = this.configService.getApiUrl();
        return this.http.get<{data:Game[] }>(`${apiUrl}/games/upcoming`);
    }
}
