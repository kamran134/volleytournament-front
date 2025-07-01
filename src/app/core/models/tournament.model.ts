import { Team } from "./team.model";

export interface Tournament {
    _id: string;
    name: string;
    shortName?: string;
    logoUrl?: string;
    country: string;
    city: string;
    startDate: Date;
    endDate: Date;
    teams?: Team[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTournamentDto {
    name: string;
    shortName?: string;
    logoUrl?: string;
    country: string;
    city: string;
    startDate: Date;
    endDate: Date;
}

export interface UpdateTournamentDto {
    _id: string;
    name?: string;
    shortName?: string;
    logoUrl?: string;
    country?: string;
    city?: string;
    startDate?: Date;
    endDate?: Date;
    teams?: string[]; // Array of team IDs
}

export interface TournamentFilterDto {
    name?: string;
    country?: string;
    city?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
}

export interface TournamentResponse {
    data: Tournament[];
    totalCount: number;
}