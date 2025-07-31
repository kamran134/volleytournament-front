export interface Photo {
    _id: string;
    url: string; // URL of the photo
    description?: string; // Optional description of the photo
    tournament: string; // Tournament ID associated with the photo
    tour: string; // Tour ID associated with the photo
    team?: string[]; // Optional Team ID associated with the photo
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
    description?: string;
    tournament?: string;
    tour?: string;
    teams?: string[];
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