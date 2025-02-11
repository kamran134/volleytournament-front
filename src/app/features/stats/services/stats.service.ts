import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { Observable } from 'rxjs';
import { Stats } from '../../../models/stats.model';

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    constructor(private http: HttpClient, private configService: ConfigService) { }

    updateStats(): Observable<any> {
        let url: string = `${this.configService.getApiUrl()}/stats`;
        return this.http.post(url, {});
    }

    updateStatsByRepublic(): Observable<any> {
        let url: string = `${this.configService.getApiUrl()}/stats/by-republic`;
        return this.http.post(url, {});
    }

    getStats(): Observable<Stats> {
        let url: string = `${this.configService.getApiUrl()}/stats`;
        return this.http.get<Stats>(url, {});
    }
}
