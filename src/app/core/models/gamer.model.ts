import { Team } from "./team.model";

export interface Gamer {
    _id: string;
    number: number;
    lastName: string;
    firstName: string;
    middleName?: string;
    birthDate: Date;
    height?: number;
    email?: string;
    role?: string;
    isCaptain: boolean;
    isCoach: boolean;
    team: Team;
}

export interface CreateGamerDto {
    number: number;
    lastName: string;
    firstName: string;
    middleName?: string;
    birthDate: Date;
    height?: number;
    email?: string;
    role?: string;
    isCaptain: boolean;
    isCoach: boolean;
    team: string; // Team ID
}

export interface UpdateGamerDto {
    _id: string;
    number?: number;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    birthDate?: Date;
    height?: number;
    email?: string;
    role?: string;
    isCaptain?: boolean;
    isCoach?: boolean;
    team?: string; // Team ID
}

export interface GamerFilterDto {
    number?: number;
    lastName?: string;
    firstName?: string;
    isCaptain?: boolean;
    isCoach?: boolean;
}

export interface GamerResponse {
    data: Gamer[];
    totalCount: number;
}