export interface ResponseFromBackend {
    data: any;
    message?: string;
    error?: string;
    totalCount?: number;
    missingDistrictCodes?: number[];
    incorrectSchoolCodes?: number[];
    schoolCodesWithoutDistrictCodes?: number[];
    missingSchoolCodes?: number[];
    incorrectTeacherCodes?: number[];
    teacherCodesWithoutSchoolCodes?: number[];
    incorrectStudentCodes?: number[];
    studentsWithoutTeacher?: number[];
}

// Authentication response interfaces
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number; // Token expiration in seconds
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string; // Backend might return a new refresh token for security
    expiresIn?: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}