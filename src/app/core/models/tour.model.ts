import { Game } from "./game.model";
import { Tournament } from "./tournament.model";

export interface Tour {
    _id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    tournament: Tournament; // Tournament
}

export interface TourWithGames extends Tour {
    games: Game[];
}

export interface CreateTourDto {
    name: string;
    startDate: Date;
    endDate: Date;
    tournament: string; // Tournament ID
    isNewTour?: boolean; // Flag to indicate if this is a new tour creation
}

export interface UpdateTourDto {
    _id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    tournament: string; // Tournament ID
    isNewTour?: boolean; // Flag to indicate if this is a new tour creation
}

export interface TourFilterDto {
    name?: string;
    startDate?: Date;
    endDate?: Date;
    tournament?: string; // Tournament ID
}

export interface TourResponse {
    data: Tour[];
    totalCount: number;
}

export interface TourWithGamesResponse {
    data: TourWithGames[];
    totalCount: number;
}
