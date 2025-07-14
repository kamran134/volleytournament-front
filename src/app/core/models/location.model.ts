export interface Location {
    _id: string;
    name: string;
    address: string;
    url: string;
    latitude?: number;
    longitude?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateLocationDto {
    name: string;
    address: string;
    url: string;
    latitude?: number;
    longitude?: number;
    isNewLocation?: boolean; // Flag to indicate if this is a new location
}

export interface UpdateLocationDto {
    _id: string;
    name?: string;
    address?: string;
    url?: string;
    latitude?: number;
    longitude?: number;
    isNewLocation?: boolean; // Flag to indicate if this is a new location
}

export interface LocationFilterDto {
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    page?: number;
    pageSize?: number;
}

export interface LocationResponse {
    data: Location[];
    totalCount: number;
}