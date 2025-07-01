import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../../core/services/config.service";
import { TournamentParams, UserParams } from "../../../core/models/filterParams.model";
import { Observable } from "rxjs";
import { UserData, UserEdit } from "../../../core/models/user.model";
import { TournamentResponse } from "../../../core/models/tournament.model";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    
    constructor(private http: HttpClient, private configService: ConfigService) { }

    /**
     * Fetches users based on the provided parameters.
     * @param userParams - Parameters to filter users.
     * @returns An observable containing user data.
     */

    getUsers(userParams: UserParams): Observable<UserData> {
        let url: string = `${this.configService.getApiUrl()}/users`;
        if (userParams.page && userParams.size) {
            url = `${url}?page=${userParams.page}&size=${userParams.size}`;
        }
        if (userParams.email) {
            url = `${url}&email=${userParams.email}`;
        }
        if (userParams.role) {
            url = `${url}&role=${userParams.role}`;
        }
        if (userParams.isApproved !== undefined) {
            url = `${url}&isApproved=${userParams.isApproved}`;
        }
        if (userParams.createdAt) {
            url = `${url}&createdAt=${userParams.createdAt.toISOString()}`;
        }
        if (userParams.updatedAt) {
            url = `${url}&updatedAt=${userParams.updatedAt.toISOString()}`;
        }
        return this.http.get<UserData>(url, { withCredentials: true });
    }

    createUser(user: UserEdit): Observable<UserData> {
        const url = `${this.configService.getApiUrl()}/users`;
        return this.http.post<UserData>(url, user, { withCredentials: true });
    }

    editUser(user: UserEdit): Observable<UserData> {
        const url = `${this.configService.getApiUrl()}/users`;
        return this.http.put<any>(url, user, { withCredentials: true });
    }

    deleteUser(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/users/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }


    getTournaments(userParams: TournamentParams): Observable<TournamentResponse> {
        let url: string = `${this.configService.getApiUrl()}/tournaments`;
        if (userParams.page && userParams.size) {
            url = `${url}?page=${userParams.page}&size=${userParams.size}`;
        }
        if (userParams.name) {
            url = `${url}&name=${userParams.name}`;
        }
        if (userParams.country) {
            url = `${url}&country=${userParams.country}`;
        }
        if (userParams.city) {
            url = `${url}&city=${userParams.city}`;
        }
        if (userParams.startDate) {
            url = `${url}&startDate=${userParams.startDate.toISOString()}`;
        }
        if (userParams.endDate) {
            url = `${url}&endDate=${userParams.endDate.toISOString()}`;
        }
        return this.http.get<TournamentResponse>(url, { withCredentials: true });
    }

    createTournament(tournament: any): Observable<any> {
        const url = `${this.configService.getApiUrl()}/tournaments`;
        return this.http.post<any>(url, tournament, { withCredentials: true });
    }

    editTournament(tournament: any): Observable<any> {
        const url = `${this.configService.getApiUrl()}/tournaments`;
        return this.http.put<any>(url, tournament, { withCredentials: true });
    }

    deleteTournament(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/tournaments/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }
}