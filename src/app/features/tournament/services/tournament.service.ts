import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { Tournament } from '../../../core/models/tournament.model';
import { Game } from '../../../core/models/game.model';
import { TournamentTable } from '../../../core/models/tournamentTable';

@Injectable({
    providedIn: 'root'
})
export class TournamentService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getTournamentByShortName(shortName: string) {
        const apiUrl = this.configService.getApiUrl();
        return this.http.get<{ data: Tournament }>(`${apiUrl}/tournaments/by-short-name/${shortName}`);
    }

    getUpcomingGames() {
        const apiUrl = this.configService.getApiUrl();
        return this.http.get<{data:Game[] }>(`${apiUrl}/games/upcoming`);
    }

    getTournamentTable(tournamentId: string) {
        const apiUrl = this.configService.getApiUrl();
        return this.http.get<{ data: TournamentTable }>(`${apiUrl}/stats/table/${tournamentId}`);
    }
}
