import { District } from "./district.model";
import { ExamResult } from "./examResult.model";
import { School } from "./school.model";
import { Teacher } from "./teacher.model";

export interface StudentData {
    data: Student[];
    totalCount: number;
}

export interface StudentWithResultData {
    data: StudentWithResult;
}

export interface Student {
    _id: string;
    lastName: string;
    firstName: string;
    middleName: string;
    code: number;
    grade: number;
    teacher: Teacher;
    school: School;
    district: District;
    status?: string;
    score?: number;
}

export interface StudentWithResult {
    _id: string;
    lastName: string;
    firstName: string;
    middleName: string;
    code: number;
    grade: number;
    teacher: Teacher;
    school: School;
    district: District;
    status: string;
    results: ExamResult[];
}