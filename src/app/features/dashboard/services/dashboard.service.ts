import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../../core/services/config.service";
import { GamerParams, TeamParams, TournamentParams, UserParams } from "../../../core/models/filterParams.model";
import { Observable, of, switchMap } from "rxjs";
import { UserData, UserEdit } from "../../../core/models/user.model";
import { CreateTournamentDto, Tournament, TournamentResponse, UpdateTournamentDto } from "../../../core/models/tournament.model";
import { Game, GameResponse } from "../../../core/models/game.model";
import { CreateLocationDto, LocationResponse, UpdateLocationDto } from "../../../core/models/location.model";
import { CreateTourDto, Tour, TourResponse, UpdateTourDto } from "../../../core/models/tour.model";

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

    createTournament(tournament: CreateTournamentDto): Observable<TournamentResponse> {
        const formData = new FormData();
        formData.append('name', tournament.name);
        formData.append('shortName', tournament.shortName || tournament.name);
        formData.append('country', tournament.country || 'Azerbaijan');
        formData.append('city', tournament.city || 'Baku');
        formData.append('isActive', tournament.isActive ? 'true' : 'false');
        formData.append('startDate', tournament.startDate.toISOString());
        formData.append('endDate', tournament.endDate.toISOString());
        formData.append('statute', tournament.statute || '')
        
        if (tournament.logo instanceof File) {
            formData.append('logo', tournament.logo);
        }

        const url = `${this.configService.getApiUrl()}/tournaments`;
        return this.http.post<TournamentResponse>(url, formData, { withCredentials: true });
    }

    editTournament(tournament: UpdateTournamentDto): Observable<TournamentResponse> {
        const formData = new FormData();
        if (tournament._id) formData.append('_id', tournament._id);
        if (tournament.name) formData.append('name', tournament.name);
        if (tournament.shortName) formData.append('shortName', tournament.shortName);
        if (tournament.country) formData.append('country', tournament.country);
        if (tournament.city) formData.append('city', tournament.city);
        if (tournament.statute) formData.append('statute', tournament.statute);
        if (tournament.startDate) formData.append('startDate', tournament.startDate.toISOString());
        if (tournament.endDate) formData.append('endDate', tournament.endDate.toISOString());
        if (tournament.teams && tournament.teams.length > 0) {
            formData.append('teams', JSON.stringify(tournament.teams)); // Отправляем массив как JSON-строку
        }
        if (tournament.logo instanceof File) {
            formData.append('logo', tournament.logo);
        }

        const url = `${this.configService.getApiUrl()}/tournaments`;
        return this.http.put<TournamentResponse>(url, formData, { withCredentials: true });
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
        if (teamParams.createdBy) {
            url = `${url}&createdBy=${teamParams.createdBy}`;
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
        url = `${url}?page=${gamerParams.page}&size=${gamerParams.size}`;
        
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
        if (gamerParams.teams && gamerParams.teams.length > 0) {
            url = `${url}&teams=${gamerParams.teams.join(',')}`;
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


    getGames(params: { page: number; size: number; teams?: string[] }): Observable<GameResponse> {
        let url: string = `${this.configService.getApiUrl()}/games?page=${params.page}&size=${params.size}`;
        if (params.teams && params.teams.length > 0) {
            url = `${url}&teams=${params.teams.join(',')}`;
        }
        return this.http.get<any>(url, { withCredentials: true });
    }

    createGame(game: any): Observable<any> {
        const url = `${this.configService.getApiUrl()}/games`;
        return this.http.post<any>(url, game, { withCredentials: true });
    }

    editGame(game: any): Observable<any> {
        const url = `${this.configService.getApiUrl()}/games`;
        return this.http.put<any>(url, game, { withCredentials: true });
    }

    deleteGame(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/games/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }


    getLocations(params: { page: number; size: number; }): Observable<LocationResponse> {
        let url: string = `${this.configService.getApiUrl()}/locations?page=${params.page}&size=${params.size}`;
        return this.http.get<LocationResponse>(url, { withCredentials: true });
    }

    createLocation(location: CreateLocationDto): Observable<any> {
        const url = `${this.configService.getApiUrl()}/locations`;
        return this.http.post<any>(url, location, { withCredentials: true });
    }

    editLocation(location: UpdateLocationDto): Observable<any> {
        const url = `${this.configService.getApiUrl()}/locations`;
        return this.http.put<any>(url, location, { withCredentials: true });
    }

    deleteLocation(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/locations/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }


    getTours(params: { page: number; size: number; tournament?: string }): Observable<TourResponse> {
        let url: string = `${this.configService.getApiUrl()}/tours?page=${params.page}&size=${params.size}`;
        if (params.tournament) {
            url = `${url}&tournament=${params.tournament}`;
        }
        return this.http.get<TourResponse>(url, { withCredentials: true });
    }

    getTourById(id: string): Observable<Tour> {
        const url = `${this.configService.getApiUrl()}/tours/${id}`;
        return this.http.get<Tour>(url, { withCredentials: true });
    }

    createTour(tour: CreateTourDto): Observable<Tour> {
        const url = `${this.configService.getApiUrl()}/tours`;
        return this.http.post<Tour>(url, tour, { withCredentials: true });
    }

    editTour(tour: UpdateTourDto): Observable<Tour> {
        const url = `${this.configService.getApiUrl()}/tours`;
        return this.http.put<Tour>(url, tour, { withCredentials: true });
    }

    deleteTour(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/tours/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }
}