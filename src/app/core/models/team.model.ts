import { Gamer } from "./gamer.model";
import { Tournament } from "./tournament.model";
import { User } from "./user.model";

export interface Team {
    _id: string;
    name: string;
    shortName?: string;
    logoUrl?: string;
    country: string;
    city: string;
    captain?: Gamer;
    tournaments?: Tournament[];
    createdBy?: string; // User ID of the creator
    createdAt: string;
    updatedAt: string;
}

export interface TeamStats {
    team: Team;
    points: number; // Очки
    matchesPlayed: number; // Сыграно матчей
    matchesWon: number; // Выиграно матчей
    matchesLost: number; // Проиграно матчей
    matchesDrawn: number; // Ничьи
}

export interface TeamDetailsDto {
    _id: string;
    name: string;
    shortName?: string;
    logoUrl?: string;
    country: string;
    city: string;
    players?: Gamer[];
    coaches?: Gamer[];
    captain?: Gamer;
    tournaments?: Tournament[];
    createdBy?: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTeamDto {
    isNewTeam: boolean;
    name: string;
    shortName?: string;
    logoUrl?: string;
    logo?: File;
    country: string;
    city: string;
    tournaments?: string[]; // Array of tournament IDs
    createdBy?: string; // User ID of the creator
}

export interface UpdateTeamDto {
    _id: string;
    isNewTeam: boolean;
    name?: string;
    shortName?: string;
    logoUrl?: string;
    logo?: File;
    country?: string;
    city?: string;
    tournaments?: string[]; // Array of tournament IDs
    createdBy?: string; // User ID of the creator
}

export interface TeamFilterDto {
    name?: string;
    country?: string;
    city?: string;
    captain?: string;
    createdBy?: string;
}

export interface TeamResponse {
    data: Team[];
    totalCount: number;
}