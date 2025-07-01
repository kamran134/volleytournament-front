export interface FilterParams {
    page?: number;
    size?: number;
    districtIds?: string;
    schoolIds?: string;
    teacherIds?: string;
    defective?: boolean;
    grades?: string;
    examIds?: string;
    examId?: string;
    sortColumn?: string;
    sortDirection?: string;
    code?: string;
    month?: string;
}

export interface UserParams {
    email?: string;
    role?: string;
    isApproved?: boolean;
    page?: number;
    size?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TournamentParams {
    name?: string;
    country?: string;
    city?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    size?: number;
}