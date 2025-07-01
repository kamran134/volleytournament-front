import { Gamer } from "./gamer.model";
import { Tournament } from "./tournament.model";

export interface Team {
    _id: string;
    name: string;
    shortName?: string;
    logoUrl?: string;
    country: string;
    city: string;
    captain?: Gamer;
    tournaments?: Tournament[];
    createdAt: string;
    updatedAt: string;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTeamDto {
    name: string;
    shortName?: string;
    logoUrl?: string;
    country: string;
    city: string;
    tournaments?: string[]; // Array of tournament IDs
}

export interface UpdateTeamDto {
    _id: string;
    name?: string;
    shortName?: string;
    logoUrl?: string;
    country?: string;
    city?: string;
    tournaments?: string[]; // Array of tournament IDs
}

export interface TeamFilterDto {
    name?: string;
    country?: string;
    city?: string;
    captain?: string;
}

export interface TeamResponse {
    data: Team[];
    totalCount: number;
}