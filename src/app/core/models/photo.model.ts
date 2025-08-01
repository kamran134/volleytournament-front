import { Team } from "./team.model";
import { Tour } from "./tour.model";
import { Tournament } from "./tournament.model";

export interface Photo {
    _id: string;
    url: string; // URL of the photo
    description?: string; // Optional description of the photo
    tournament: Tournament; // Tournament ID associated with the photo
    tour: Tour; // Tour ID associated with the photo
    teams?: Team[]; // Optional Team ID associated with the photo
    selected?: boolean; // For selection in UI, e.g., for bulk actions
    createdBy?: string; // User ID of the creator
    createdAt: Date; // Creation date
    updatedAt: Date; // Last update date
}

export interface CreatePhotoDto {
    description?: string;
    tournament: string;
    tour: string;
    teams?: string[];
    file: File; // The photo file to be uploaded
}

export interface CreatePhotosDto {
    description?: string;
    tournament: string;
    tour: string;
    teams?: string[];
    files: File[]; // Array of photo files to be uploaded
}

export interface UpdatePhotoDto {
    _id: string; // Photo ID to be updated
    description?: string;
    tournament?: Tournament;
    tour?: Tour;
    teams?: Team[];
    url?: string;
    file?: File; // Optional file to be updated
}

export interface PhotoFilterDto {
    tournament?: string;
    tour?: string;
    teams?: string[];
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PhotoResponse {
    data: Photo[];
    totalCount: number; // Total number of photos matching the filter
}