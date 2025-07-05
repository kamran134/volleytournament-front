import { Team } from "./team.model";

export interface Game {
    _id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    tournament: string; // Tournament ID
    team1: Team;
    team2: Team;

}

export interface CreateGameDto {
    name: string;
    startDate: Date;
    endDate: Date;
    tournament: string; // Tournament ID
    team1: string; // Team 1 ID
    team2: string; // Team 2 ID
}

export interface UpdateGameDto {
    _id: string;
    name?: string;
    startDate?: Date;
    endDate?: Date;
    tournament?: string; // Tournament ID
    team1?: string; // Team 1 ID
    team2?: string; // Team 2 ID
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