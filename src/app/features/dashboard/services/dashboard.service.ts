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
import { CreateTeamDto, TeamResponse, UpdateTeamDto } from "../../../core/models/team.model";
import { CreatePhotoDto, CreatePhotosDto, Photo, PhotoResponse, UpdatePhotoDto } from "../../../core/models/photo.model";

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

    // USERS
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


    // TOURNAMENTS
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


    // TEAMS
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

    createTeam(team: CreateTeamDto): Observable<TeamResponse> {
        const formData = new FormData();
        formData.append('name', team.name);
        formData.append('shortName', team.shortName || team.name);
        formData.append('country', team.country || 'Azerbaijan');
        formData.append('city', team.city || 'Baku');
        if (team.logo instanceof File) {
            formData.append('logo', team.logo);
        }
        if (team.tournaments && team.tournaments.length > 0) {
            formData.append('tournaments', JSON.stringify(team.tournaments)); // Отправляем массив как JSON-строку
        }
        
        const url = `${this.configService.getApiUrl()}/teams`;
        return this.http.post<TeamResponse>(url, formData, { withCredentials: true });
    }

    editTeam(team: UpdateTeamDto): Observable<TeamResponse> {
        const formData = new FormData();
        if (team._id) formData.append('_id', team._id);
        if (team.name) formData.append('name', team.name);
        if (team.shortName) formData.append('shortName', team.shortName);
        if (team.country) formData.append('country', team.country);
        if (team.city) formData.append('city', team.city);
        if (team.logo instanceof File) {
            formData.append('logo', team.logo);
        }
        if (team.tournaments && team.tournaments.length > 0) {
            formData.append('tournaments', JSON.stringify(team.tournaments)); // Отправляем массив как JSON-строку
        }
        
        const url = `${this.configService.getApiUrl()}/teams`;
        return this.http.put<TeamResponse>(url, formData, { withCredentials: true });
    }

    deleteTeam(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/teams/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }

    
    // GAMERS
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


    // GAMES
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


    // LOCATIONS
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


    // TOURS
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


    // GALLERY
    getPhotos(params: { page: number; size: number; tournaments?: string[]; teams?: string[]; tours?: string[] }): Observable<PhotoResponse> {
        let url: string = `${this.configService.getApiUrl()}/photos?page=${params.page}&size=${params.size}`;
        if (params.tournaments && params.tournaments.length > 0) {
            url = `${url}&tournaments=${params.tournaments.join(',')}`;
        }
        if (params.teams && params.teams.length > 0) {
            url = `${url}&teams=${params.teams.join(',')}`;
        }
        if (params.tours && params.tours.length > 0) {
            url = `${url}&tours=${params.tours.join(',')}`;
        }
        return this.http.get<PhotoResponse>(url, { withCredentials: true });
    }

    getPhotoById(id: string): Observable<Photo> {
        const url = `${this.configService.getApiUrl()}/photos/${id}`;
        return this.http.get<Photo>(url, { withCredentials: true });
    }

    createPhoto(photo: CreatePhotoDto): Observable<Photo> {
        const formData = new FormData();
        formData.append('description', photo.description || '');
        formData.append('tournament', photo.tournament);
        formData.append('tour', photo.tour);
        if (photo.teams && photo.teams.length > 0) {
            formData.append('teams', JSON.stringify(photo.teams)); // Отправляем массив как JSON-строку
        }
        formData.append('file', photo.file);
        
        const url = `${this.configService.getApiUrl()}/photos`;
        return this.http.post<Photo>(url, formData, { withCredentials: true });
    }

    createPhotos(photos: CreatePhotosDto): Observable<PhotoResponse> {
        const formData = new FormData();
        formData.append('description', photos.description || '');
        formData.append('tournament', photos.tournament);
        formData.append('tour', photos.tour);
        if (photos.teams && photos.teams.length > 0) {
            formData.append('teams', JSON.stringify(photos.teams)); // Отправляем массив как JSON-строку
        }
        photos.files.forEach(file => {
            formData.append('files', file);
        });
        const url = `${this.configService.getApiUrl()}/photos/bulk`;
        return this.http.post<PhotoResponse>(url, formData, { withCredentials: true });
    }

    editPhoto(photo: UpdatePhotoDto): Observable<Photo> {
        const formData = new FormData();
        formData.append('description', photo.description || '');
        formData.append('tournament', photo.tournament || '');
        formData.append('tour', photo.tour || '');
        if (photo.teams && photo.teams.length > 0) {
            formData.append('teams', JSON.stringify(photo.teams)); // Отправляем массив как JSON-строку
        }
        if (photo.file) {
            formData.append('file', photo.file);
        }

        const url = `${this.configService.getApiUrl()}/photos`;
        return this.http.put<Photo>(url, formData, { withCredentials: true });
    }

    deletePhoto(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/photos/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }

    deletePhotos(ids: string[]): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/photos/bulk`;
        return this.http.request<{message: string}>('DELETE', url, {
            withCredentials: true,
            body: { ids }
        });
    }
}