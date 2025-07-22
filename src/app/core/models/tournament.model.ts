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
    statute?: string; // Tournament regulation document
    teams?: Team[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTournamentDto {
    isNewTournament: boolean;
    name: string;
    shortName?: string;
    logoUrl?: string;
    logo?: File;
    country: string;
    city: string;
    startDate: Date;
    endDate: Date;
    statute?: string; // Tournament regulation document
    isActive?: boolean;
}

export interface UpdateTournamentDto {
    _id: string;
    isNewTournament: boolean;
    name: string;
    shortName?: string;
    logoUrl?: string;
    logo?: File;
    country?: string;
    city?: string;
    startDate?: Date;
    endDate?: Date;
    statute?: string; // Tournament regulation document
    isActive?: boolean;
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