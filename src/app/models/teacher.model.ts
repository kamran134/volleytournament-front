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
}