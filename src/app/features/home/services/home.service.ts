import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { Tournament } from '../../../core/models/tournament.model';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getTournaments() {
        const apiUrl = this.configService.getApiUrl();
        return this.http.get<{ data: Tournament[] }>(`${apiUrl}/tournaments`);
    }
}
