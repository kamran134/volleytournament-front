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