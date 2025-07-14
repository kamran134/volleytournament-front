import { Location } from "./location.model";
import { Team } from "./team.model";
import { Tournament } from "./tournament.model";

export interface Game {
    _id: string;
    name?: string;
    startDate: Date;
    endDate: Date;
    tournament: Tournament; // Tournament ID
    team1: Team;
    team2: Team;
    scoreTeam1?: number; // Optional score for team 1
    scoreTeam2?: number; // Optional score for team 2
    winner?: Team; // Winner ID, optional for updates
    location: Location;
}

export interface CreateGameDto {
    name?: string;
    startDate: Date;
    endDate: Date;
    tournament: string; // Tournament ID
    team1: string; // Team 1 ID
    team2: string; // Team 2 ID
    scoreTeam1?: number; // Optional score for team 1
    scoreTeam2?: number; // Optional score for team 2
    isNewGame?: boolean; // Flag to indicate if this is a new game
    winner?: string; // Winner ID, optional for new games
    location: string; // Location ID
}

export interface UpdateGameDto {
    _id: string;
    name?: string;
    startDate?: Date;
    endDate?: Date;
    tournament?: Tournament; // Tournament ID
    team1?: Team; // Team 1 ID
    team2?: Team; // Team 2 ID
    scoreTeam1?: number; // Optional score for team 1
    scoreTeam2?: number; // Optional score for team 2
    winner?: Team; // Winner ID, optional for updates
    location?: Location; // Location ID
    isNewGame?: boolean; // Flag to indicate if this is a new game
}

export interface GameFilterDto {
    name?: string;
    startDate?: Date;
    endDate?: Date;
    tournament?: string; // Tournament ID
    team1?: string; // Team 1 ID
    team2?: string; // Team 2 ID
}

export interface GameResponse {
    data: Game[];
    totalCount: number;
}