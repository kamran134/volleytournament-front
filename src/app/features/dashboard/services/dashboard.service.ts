import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../../core/services/config.service";
import { GamerParams, TeamParams, TournamentParams, UserParams } from "../../../core/models/filterParams.model";
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


    getTournaments(tournamentParams: TournamentParams): Observable<TournamentResponse> {
        let url: string = `${this.configService.getApiUrl()}/tournaments`;
        if (tournamentParams.page && tournamentParams.size) {
            url = `${url}?page=${tournamentParams.page}&size=${tournamentParams.size}`;
        }
        if (tournamentParams.name) {
            url = `${url}&name=${tournamentParams.name}`;
        }
        if (tournamentParams.country) {
            url = `${url}&country=${tournamentParams.country}`;
        }
        if (tournamentParams.city) {
            url = `${url}&city=${tournamentParams.city}`;
        }
        if (tournamentParams.startDate) {
            url = `${url}&startDate=${tournamentParams.startDate.toISOString()}`;
        }
        if (tournamentParams.endDate) {
            url = `${url}&endDate=${tournamentParams.endDate.toISOString()}`;
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


    getTeams(teamParams: TeamParams): Observable<any> {
        let url: string = `${this.configService.getApiUrl()}/teams`;
        if (teamParams.page && teamParams.size) {
            url = `${url}?page=${teamParams.page}&size=${teamParams.size}`;
        }
        if (teamParams.name) {
            url = `${url}&name=${teamParams.name}`;
        }
        if (teamParams.country) {
            url = `${url}&country=${teamParams.country}`;
        }
        if (teamParams.city) {
            url = `${url}&city=${teamParams.city}`;
        }
        if (teamParams.captain) {
            url = `${url}&captain=${teamParams.captain}`;
        }
        if (teamParams.coach) {
            url = `${url}&coach=${teamParams.coach}`;
        }
        return this.http.get<any>(url, { withCredentials: true });
    }

    createTeam(team: any): Observable<any> {
        const url = `${this.configService.getApiUrl()}/teams`;
        return this.http.post<any>(url, team, { withCredentials: true });
    }

    editTeam(team: any): Observable<any> {
        const url = `${this.configService.getApiUrl()}/teams`;
        return this.http.put<any>(url, team, { withCredentials: true });
    }

    deleteTeam(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/teams/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }

    
    getGamers(gamerParams: GamerParams): Observable<any> {
        let url: string = `${this.configService.getApiUrl()}/gamers`;
        if (gamerParams.page && gamerParams.size) {
            url = `${url}?page=${gamerParams.page}&size=${gamerParams.size}`;
        }
        if (gamerParams.number) {
            url = `${url}&number=${gamerParams.number}`;
        }
        if (gamerParams.lastName) {
            url = `${url}&lastName=${gamerParams.lastName}`;
        }
        if (gamerParams.firstName) {
            url = `${url}&firstName=${gamerParams.firstName}`;
        }
        if (gamerParams.isCaptain !== undefined) {
            url = `${url}&isCaptain=${gamerParams.isCaptain}`;
        }
        if (gamerParams.isCoach !== undefined) {
            url = `${url}&isCoach=${gamerParams.isCoach}`;
        }
        if (gamerParams.team) {
            url = `${url}&team=${gamerParams.team}`;
        }
        return this.http.get<any>(url, { withCredentials: true });
    }

    createGamer(gamer: any): Observable<any> {
        const url = `${this.configService.getApiUrl()}/gamers`;
        return this.http.post<any>(url, gamer, { withCredentials: true });
    }

    editGamer(gamer: any): Observable<any> {
        const url = `${this.configService.getApiUrl()}/gamers`;
        return this.http.put<any>(url, gamer, { withCredentials: true });
    }

    deleteGamer(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/gamers/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }
}