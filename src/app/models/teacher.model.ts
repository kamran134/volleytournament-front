import { District } from "./district.model";
import { School } from "./school.model";

export interface TeacherData {
    data: Teacher[];
    totalCount: number;
}

export interface Teacher {
    _id: string;
    fullname: string;
    code: number;
    school: School;
    district: District;
    score?: number;
    averageScore?: number;
}

export interface TeacherForCreation {
    fullname: string;
    code: number;
    school?: School;
    district?: District;
}