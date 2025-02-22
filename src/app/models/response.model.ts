export interface ResponseFromBackend {
    data: any;
    message?: string;
    error?: string;
    totalCount?: number;
    missingDistrictCodes?: number[];
    schoolCodesWithoutDistrictCodes?: number[];
    missingSchoolCodes?: number[];
    teacherCodesWithoutSchoolCodes?: number[];
    studentsWithoutTeacher?: number[];
}