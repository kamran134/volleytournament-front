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

    getStats(month: string): Observable<Stats> {
        let url: string = `${this.configService.getApiUrl()}/stats?month=${month}`;
        return this.http.get<Stats>(url, {});
    }

    getStatsByExam(examId: string): Observable<Stats> {
        console.log('getStatsByExam', examId);
        let url: string = `${this.configService.getApiUrl()}/stats/by-exam/${examId}`;
        return this.http.get<Stats>(url, {});
    }

    getTeacherStats(): Observable<Stats> {
        let url: string = `${this.configService.getApiUrl()}/stats/teachers`;
        return this.http.get<Stats>(url, {});
    }

    getSchoolStats(): Observable<Stats> {
        let url: string = `${this.configService.getApiUrl()}/stats/schools`;
        return this.http.get<Stats>(url, {});
    }
}
