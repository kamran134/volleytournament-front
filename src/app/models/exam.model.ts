export interface ExamData {
    data: Exam[];
    totalCount: number;
}

export interface Exam {
    _id: string;
    name: string;
    code: number;
    date: Date;
}