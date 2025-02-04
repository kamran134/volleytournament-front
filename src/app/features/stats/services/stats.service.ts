import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    constructor(private http: HttpClient, private configService: ConfigService) { }

    updateStats(): void {
        let url: string = `${this.configService.getApiUrl()}/stats`;
        this.http.post(url, {}).subscribe();
    }
}
