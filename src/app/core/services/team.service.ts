import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Team, CreateTeamDto, UpdateTeamDto, TeamFilterDto, TeamResponse } from '../models/team.model';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private apiUrl = `${this.configService.getApiUrl()}/teams`;

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getTeams(filter: TeamFilterDto = {}): Observable<TeamResponse> {
        const params = Object.entries(filter).reduce((httpParams, [key, value]) => {
            if (value !== undefined && value !== null) {
                return httpParams.set(key, value as any);
            }
            return httpParams;
        }, new HttpParams());
        return this.http.get<TeamResponse>(this.apiUrl, { params })
            .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Failed to fetch teams'))));
    }

    createTeam(dto: CreateTeamDto): Observable<void> {
        return this.http.post<void>(this.apiUrl, dto)
            .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Failed to create team'))));
    }

    updateTeam(id: string, dto: UpdateTeamDto): Observable<void> {
        return this.http.put<void>(this.apiUrl, { id, ...dto })
            .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Failed to update team'))));
    }

    deleteTeam(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(catchError((err) => throwError(() => new Error(err.error?.message || 'Failed to delete team'))));
    }
}