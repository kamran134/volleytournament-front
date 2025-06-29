export interface Team {
    _id: string;
    name: string;
    shortName?: string;
    logoUrl?: string;
    country: string;
    city: string;
    players?: string[];
    coaches?: string[];
    captain?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTeamDto {
    name: string;
    shortName?: string;
    logoUrl?: string;
    country: string;
    city: string;
    players?: string[];
    coaches?: string[];
    captain?: string;
}

export interface UpdateTeamDto {
    name?: string;
    shortName?: string;
    logoUrl?: string;
    country?: string;
    city?: string;
    players?: string[];
    coaches?: string[];
    captain?: string;
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