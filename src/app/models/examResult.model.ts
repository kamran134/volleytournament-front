export interface ExamResult {
    _id: string;
    disciplines: { az: number; math: number; lifeKnowledge: number; logic: number; }
    exam: string;
    grade: number;
    level: string;
    score: number;
    student: string;
    totalScore: number;
}