import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoResponse } from '../../../core/models/photo.model';
import { ConfigService } from '../../../core/services/config.service';
import { HttpClient } from '@angular/common/http';
import { TournamentResponse } from '../../../core/models/tournament.model';
import { TourResponse } from '../../../core/models/tour.model';
import { TeamResponse } from '../../../core/models/team.model';

@Injectable({
    providedIn: 'root'
})
export class GalleryService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getPhotos(params: { page: number; size: number; tournament?: string; tour?: string; teams?: string[]; }): Observable<PhotoResponse> {
        let url: string = `${this.configService.getApiUrl()}/photos?page=${params.page}&size=${params.size}`;
        if (params.tournament) {
            url = `${url}&tournament=${params.tournament}`;
        }
        if (params.teams && params.teams.length > 0) {
            url = `${url}&teams=${params.teams.join(',')}`;
        }
        if (params.tour) {
            url = `${url}&tour=${params.tour}`;
        }
        return this.http.get<PhotoResponse>(url, { withCredentials: true });
    }

    getLastPhotos(): Observable<PhotoResponse> {
        const url: string = `${this.configService.getApiUrl()}/photos/last`;
        return this.http.get<PhotoResponse>(url, { withCredentials: true });
    }

    getTournaments(): Observable<TournamentResponse> {
        const url: string = `${this.configService.getApiUrl()}/tournaments`;
        return this.http.get<TournamentResponse>(url, { withCredentials: true });
    }

    getTours(tournament: string): Observable<TourResponse> {
        console.log('Fetching tours for tournament:', tournament);
        if (!tournament) {
            throw new Error('Tournament ID is required to fetch tours');
        }
        const url: string = `${this.configService.getApiUrl()}/tours`;
        return this.http.get<TourResponse>(url, { params: { tournament }, withCredentials: true });
    }

    getTeams(tournament: string): Observable<TeamResponse> {
        if (!tournament) {
            throw new Error('Tournament ID is required to fetch teams');
        }
        const url: string = `${this.configService.getApiUrl()}/teams`;
        return this.http.get<TeamResponse>(url, { params: { tournament }, withCredentials: true });
    }
}
