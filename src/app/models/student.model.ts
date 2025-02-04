import { Teacher } from "./teacher.model";

export interface StudentData {
    data: Student[];
    totalCount: number;
}

export interface Student {
    _id: string;
    lastName: string;
    firstName: string;
    middleName: string;
    code: number;
    grade: number;
    teacher: Teacher;
}